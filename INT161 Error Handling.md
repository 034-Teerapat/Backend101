INT161 · Basic Backend Development · Week-06

# Error / Exception Handling

ติวจากไฟล์ 06-INT161-Error Handling 1.pdf · ครบ 16 สไลด์

สไลด์ 1–16Part A–Fศัพท์อังกฤษตัวหนา

## ภาพรวมของหัวข้อ

บทนี้ตอบคำถามว่า "เมื่อโค้ดฝั่ง backend เกิดข้อผิดพลาด จะจัดการอย่างไรไม่ให้เซิร์ฟเวอร์ล้ม และให้ client ได้ response ที่เข้าใจได้" เริ่มจากแนวคิด **Exception/Error** และ **Error propagation** ผ่านชั้น Controller → Service → Repository จากนั้นดูการจัดการแบบ sync ด้วย `try..catch`, ออบเจกต์ **Error** มาตรฐาน, การสร้าง **Custom Error class** (`AppError`) แล้วต่อด้วยกลไกของ Express: **Middleware**, `next(err)` และ **Error-handling middleware** ที่มี 4 พารามิเตอร์ (err, req, res, next) พร้อมตาราง HTTP status code ที่ใช้บ่อย

[Part Aวัตถุประสงค์และ Layered System1–3](#A) [Part BError คืออะไร ทำไมต้องจัดการ และ propagation4–6](#B) [Part Ctry..catch และออบเจกต์ Error7–9](#C) [Part DCustom Error Classes (AppError)10–11](#D) [Part EExpress Middleware และกลไกจัดการ error12–13](#E) [Part FStatus code และ Error-handling middleware14–16](#F) [สรุปประเด็นสอบและ Key Termsท้ายไฟล์](#S)

Part A

## วัตถุประสงค์และ Layered System

slide 1–3

### หน้าปกและวัตถุประสงค์ slide 1–2

สไลด์ 1 คือหน้าปก "INT 161 Basic Backend Development · RESTful API · **Exception Handling**" สไลด์ 2 ระบุวัตถุประสงค์ 2 ข้อ

| ข้อ | วัตถุประสงค์ (ตามสไลด์) | ตรงกับหัวข้อ |
| --- | --- | --- |
| 1 | **Learn error handling using Express middle-ware** | Part E–F (slide 12–15) |
| 2 | **Design global error handling in Node/Express with best practices** | Part D, F (slide 10–11, 14–15) |

### Layered System กับ error slide 3

แผนภาพเดิมจากไฟล์ 03–05 แต่รอบนี้ติดป้าย **error** (ดาวสีแดง) ไว้ที่ทุกชั้น เพื่อแสดงว่า error เกิดได้ทุกระดับ

| ชั้นในภาพ | ป้ายกำกับของชั้น | มีป้าย error |
| --- | --- | --- |
| **Controller** | Presentation Layer | ✔ |
| **Service** | Business Logic Layer | ✔ |
| **Repository** | Persistence Layer | ✔ |
| ที่เก็บข้อมูล (ไอคอนฐานข้อมูล/ไฟล์) | — | ✔ |

ระหว่างชั้นส่ง **Entity Object** ต่อกัน และระหว่าง Client กับ Controller ส่ง **JSON** ตามเดิม

The Layered System principle means that a REST API is designed as a set of layers, where each layer has a specific role, and a client does not need to know whether it's communicating directly with the end server or through intermediaries. This allows scalability, flexibility, and separation of concerns.

Layered System คือการออกแบบ REST API เป็นชั้น ๆ ที่แต่ละชั้นมีบทบาทเฉพาะ และ client ไม่จำเป็นต้องรู้ว่ากำลังคุยกับเซิร์ฟเวอร์ปลายทางโดยตรงหรือผ่านตัวกลาง ทำให้ขยายระบบได้ (**scalability**) ยืดหยุ่น (**flexibility**) และแยกความรับผิดชอบ (**separation of concerns**)

Part B

## Error คืออะไร ทำไมต้องจัดการ และ propagation

slide 4–6

### What is an Exception/Error? slide 4

An exception/error is an event or condition that disrupts the normal flow of execution in a program.

Exception/Error คือเหตุการณ์หรือเงื่อนไขที่ขัดจังหวะการทำงานปกติของโปรแกรม

- ถ้ามีการ **throw** แล้ว**ไม่มีใคร catch** Node.js จะยุติ process (`process.exit(1)`) ทำให้ **backend server ทั้งตัวล่ม**
- **Error is object**: ห่อหุ้มสภาวะที่ไม่คาดคิดไว้ใน object

### Why Error Handling Matters slide 5

| เหตุผล (ตามสไลด์) | ความหมาย |
| --- | --- |
| Prevent app crashes / downtime | ไม่ให้แอปล่มหรือหยุดให้บริการ |
| Improve user experience | ให้ข้อความ error ที่เป็นมิตร (friendly error messages) |
| Protect sensitive data from leaking | ไม่ให้ข้อมูลสำคัญหลุด เช่น **stack traces** |
| Support debugging, monitoring, and alerting | ช่วยตรวจสอบ ติดตาม และแจ้งเตือน |

ประเภทของ error (**Error Types**)

| ประเภท | ตัวอย่างตามสไลด์ |
| --- | --- |
| **Programming Errors** | bugs, logic issues (`TypeError`, invalid assumptions) |
| **Operational Errors** | network timeouts, DB unavailable, file not found |
| **Expected vs Unexpected Errors** | จัดการแบบ expected ให้ "สุภาพ" (handle gracefully) |

### Error propagation slide 6

Error propagation is a mechanism that allows errors to be passed up the call stack until they are caught and handled.

Error propagation คือกลไกส่ง error ขึ้นไปตาม call stack จนกว่าจะมีใครจับ (catch) และจัดการ

- สำคัญต่อการ **debug** และทำให้ error ไม่ทำแอปล่มโดยไม่คาดคิด
- เมื่อเกิด error ในฟังก์ชัน ทำได้ 2 ทาง: **จับและจัดการในฟังก์ชันนั้น** หรือ **ปล่อยให้ propagate** ขึ้นไปยังฟังก์ชันที่เรียก
- ถ้าฟังก์ชันที่เรียกไม่จัดการ จะส่งต่อขึ้นไปเรื่อย ๆ จนถึง **global scope** และอาจทำให้โปรแกรมหยุด

ส่วนเสริม · ภาพ call stack จากโค้ดสไลด์ 7

b(value)เรียก `fs.readFileSync` แล้ว **throw**

→

a(value)ไม่มี try..catch ปล่อยผ่าน

→

main()ไม่มี try..catch ปล่อยผ่าน

→

try..catch ด้านนอกถูกจับที่นี่ (ไม่งั้นถึง global scope)

Part C

## try..catch และออบเจกต์ Error

slide 7–9

### Error Handling (Sync): try .. catch slide 7

สไลด์วางโค้ดสองกล่องข้างกัน: กล่องซ้ายคือฟังก์ชัน `main → a → b` กล่องขวาคือ `try..catch` ที่ครอบการเรียก

กล่องซ้าย: ฟังก์ชัน

```
import fs from 'node:fs';

function main(value=0) {
  console.log(a(value));
}
function a(value) {
  return b(value);
}
function b(value) {
  if (value > 0) {
      return ++value;
  }
  const data = fs.readFileSync('test.txt');
}

main(); //without error handler
```

กล่องขวา: try..catch

```
try {
   main(1);
   console.log('After main success');
   console.log('------------------');
   main();
   console.log('After main error');
} catch (e) {
   console.log('Message: ', e.message);
   console.log('Status: ', e.status);
   console.log('Code: ', e.code);
   console.log('Stack Trace: ', e.stack);
}

console.log('Program was normal ended');
```

- บรรทัด `main(); //without error handler` คือกรณีไม่มีตัวจัดการ error
- `b(value)`: ถ้า `value > 0` คืน `++value` มิฉะนั้นอ่านไฟล์ `test.txt` แบบ sync
- `catch (e)` พิมพ์ **message, status, code, stack** ของ error

ส่วนเสริม · ลำดับการทำงานที่คาด (สมมติว่าไม่มีไฟล์ test.txt) สไลด์ไม่ได้แสดงผลลัพธ์ ลำดับที่น่าจะเกิด:

| ลำดับ | เหตุการณ์ |
| --- | --- |
| 1 | `main(1)` → `b(1)` คืน 2 → พิมพ์ `2` |
| 2 | พิมพ์ `After main success` และเส้นประ |
| 3 | `main()` → `b(0)` → `readFileSync` โยน error |
| 4 | **ข้าม** `After main error` กระโดดเข้า `catch` พิมพ์ message, Status (`undefined`), Code (เช่น `ENOENT`) และ stack |
| 5 | พิมพ์ `Program was normal ended` (โปรแกรมไม่ล่มเพราะถูกจับแล้ว) |

`e.status` เป็น `undefined` เพราะ error ของระบบไฟล์ไม่มี field นี้ (มีแต่ `code` และ `errno`)

### The standard JavaScript Error object slide 8

| Property | ความหมายตามสไลด์ |
| --- | --- |
| `message` | คำอธิบาย error ที่คนอ่านเข้าใจได้ (human-readable) |
| `name` | ชื่อชนิดของ error เช่น "Error", "TypeError", "ReferenceError" |
| `stack` | (ไม่ใช่มาตรฐาน แต่ใช้กันแพร่หลาย) สตริง **stack trace** บอกว่า error เกิดที่ใดในโค้ด |
| `code` | เฉพาะ system error ใน Node.js: สตริงรหัส error ของระบบ เช่น `"EACCES"` = permission denied |
| `errno` | เฉพาะ system error: ตัวเลขที่สอดคล้องกับรหัส error ของระบบ (ค่าติดลบ) |

### "Customer Error" (Custom error ด้วยการ throw) slide 9

สไลด์โชว์ฟังก์ชัน `b` แบบ `async` ที่จับ error ของระบบไฟล์ แล้วสร้าง error ใหม่พร้อม `code` และ `status` ของเราเอง

```
  :
  :
async function b(value) {
    if (value > 0) {
        return ++value;
    }
    try {
        const data = await fs.readFile('data.txt', 'utf8');
        return data;
    } catch (e) {
        const err = new Error('File data.txt not found');
        err.code = 'FILE_NOT_FOUND';
        err.status = 404;
        throw err;
    }
}
```

| ขั้นตอน | ความหมาย |
| --- | --- |
| `await fs.readFile(...)` ใน `try` | อ่านไฟล์แบบ async ถ้าสำเร็จคืนข้อมูล |
| `catch (e)` | จับ error ของระบบไฟล์ (เช่น ไม่พบไฟล์) |
| `new Error('File data.txt not found')` | สร้าง error ที่มีข้อความเข้าใจง่ายกว่า |
| `err.code = 'FILE_NOT_FOUND'`, `err.status = 404` | เติมรหัสของแอปและ HTTP status ที่ตรงความหมาย |
| `throw err` | ส่ง error ขึ้นไปให้ชั้นบน (propagate) แปลงจากรายละเอียดระบบเป็นความหมายระดับ API |

สไลด์พิมพ์ผิด / ไม่ครบ หัวข้อสไลด์เขียนว่า "**Customer** Error" ควรเป็น "**Custom** Error" (error ที่กำหนดเอง) และโค้ดมี `:` สองบรรทัดแทนส่วนที่ละไว้ (เช่น `import`) ถ้าจะรันจริงต้อง import `fs` แบบ promise เช่น `node:fs/promises` เพราะใช้ `await fs.readFile`

Part D

## Custom Error Classes (AppError)

slide 10–11

### Custom Error Classes slide 10

- สร้าง **custom error class** (เช่น `AppError`) เพื่อจัดหมวดหมู่และเพิ่มบริบทให้ error
- ช่วยให้ **error response ถึง client** มีข้อมูลมากขึ้น และช่วย **internal logging**

```
class AppError extends Error {
    errors = {404:'NOT_FOUND', 400:'BAD REQUEST', 409:'CONFLICT',
    500:'INTERNAL SERVER ERROR', 403:'FORBIDDEN', 401:'UNAUTHORIZED'}
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.error = this.errors[statusCode];
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
```

| ส่วนของโค้ด | ความหมาย |
| --- | --- |
| `extends Error` | สืบทอดจาก Error จึงเป็น error ที่ throw/catch ได้ตามปกติ |
| `errors = {...}` | ตารางแปลง HTTP status code → ชื่อข้อความ (404 → NOT_FOUND, 400 → BAD REQUEST, 409 → CONFLICT, 500 → INTERNAL SERVER ERROR, 403 → FORBIDDEN, 401 → UNAUTHORIZED) |
| `super(message)` | เรียก constructor ของ Error เพื่อตั้ง `message` |
| `this.statusCode` | เก็บ HTTP status code |
| `this.error = this.errors[statusCode]` | หาชื่อ error จาก status code |
| `this.isOperational = true` | ธงบอกว่าเป็น **operational error** (ข้อผิดพลาดที่คาดการณ์ได้ ต่างจาก programming error ใน slide 5) |
| `Error.captureStackTrace(this, this.constructor)` | บันทึก **stack trace** โดยไม่รวมเฟรมของ constructor เอง |

สไลด์พิมพ์ผิด ในโค้ด `403:'FORBIDDEN’` ตัวปิดเป็นเครื่องหมายคำพูดโค้ง (’) ต้องแก้เป็น (') ถึงจะรันได้

### Custom Error Classes example slide 11

ใช้ฟังก์ชัน `main/a/b` ชุดเดิมจากสไลด์ 7 แต่ใน `catch` ห่อ error ด้วย `AppError`

```
try {
  main(1);
  console.log('After main success');
  console.log('------------------');
  main();
  console.log('After main error');
} catch (e) {
  const err = new AppError(e.message, 404)
  console.log(err);
}

console.log('Program was normal ended');
```

ฟังก์ชัน `main/a/b` ในสไลด์ 11 เหมือนสไลด์ 7 (`readFileSync('test.txt')`) และมีบรรทัดคอมเมนต์ `// main(); //without error handler` ค้างอยู่

ส่วนเสริม · ข้อสังเกตการใช้งาน `new AppError(e.message, 404)` แปลง error ใด ๆ เป็น 404 ทั้งหมด ในแอปจริงควรเลือก status ให้ตรงกับสาเหตุ (เช่น ไม่พบ resource → 404, ข้อมูลไม่ถูกต้อง → 400) และ `console.log(err)` จะแสดงทั้ง message, stack และ field `statusCode / error / isOperational`

Part E

## Express Middleware และกลไกจัดการ error

slide 12–13

### Express Middleware slide 12

แผนภาพลำดับการไหลของ request ในสไลด์ (กรอบซ้าย)

Client(Request)

→

Express.js Server(http)

→

Middleware 1`next()`

→

Middleware 2`next()`

→

Router Match→ handler

→

Response`res.send()` / `res.json()`

→

Client(Response)

ข้อความอธิบาย (สไลด์เขียนเป็นภาษาไทย)

- **middleware** คือฟังก์ชันที่รับ `(req, res, next)`
- ทำงานได้หลายอย่าง เช่น **log, parse body, auth, validate**
- ถ้าเรียก `next()` → ส่งต่อไป middleware ถัดไป
- ถ้า `res.send()` หรือ `res.end()` → **จบ** (ส่ง response กลับ client)

```
// Middleware 1 - Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
})

// Middleware 2 - JSON parser
app.use(express.json())

app.use('/films', filmRouter);
```

### Error Handling Mechanism in Express.js slide 13

Express มีกลไกพิเศษจัดการ error ด้วย **error-handling middleware** 4 ขั้นตอนตามสไลด์

1. **Error Occurs**: เกิดจากโค้ดเรา (`throw new Error`, rejected Promise ฯลฯ) หรือความล้มเหลวของ middleware/route (เช่น DB query error, input ไม่ถูกต้อง)
2. **Forward Error with next(err)**: เมื่อเรียก `next(err)` Express จะ **ข้าม** middleware/route handler ปกติทั้งหมด แล้ว**กระโดดไปที่ error-handling middleware** ทันที
3. **Error Handling Middleware**: ลายเซ็นปกติคือ `(req, res, next)` ส่วนลายเซ็นของ error-handling คือ **`(err, req, res, next)`** (สไลด์เน้นตัวแดง) ใช้ดักจับและตอบ error
4. **Send Response Back**: ส่ง HTTP status code ที่เหมาะสมและข้อความ error/JSON เช่น **400 Bad Request**, **401 Unauthorized**, **500 Internal Server Error**

ส่วนเสริม · ภาพรวมเมื่อมี error (ผสมสไลด์ 12 กับ 13)

Middleware / Routerเกิด error หรือเรียก `next(err)`

→

ข้ามmiddleware และ route ปกติที่เหลือ

→

Error-handling middleware`(err, req, res, next)`

→

Response`res.status(...).json(...)`

ส่วนเสริม · เรื่อง async ที่ควรระวัง สไลด์พูดถึง "rejected Promise" โดยไม่ลงรายละเอียด ในทางปฏิบัติ Express เวอร์ชัน 5 ส่ง rejection ของ async handler เข้า error handler ให้อัตโนมัติ ส่วนเวอร์ชัน 4 ต้องจับเองด้วย `try..catch` แล้วเรียก `next(err)` (ควรเช็กเวอร์ชันที่ใช้ในโปรเจกต์)

Part F

## Status code และ Error-handling middleware

slide 14–16

### Handling Errors slide 14

ขั้นแรกของการจัดการ error คือให้ client ได้ **status code** ที่ถูกต้อง และอาจต้องใส่ **ข้อมูลเพิ่มเติมใน response body** วิธีที่ง่ายที่สุด (**Basic Responses**) คือตอบด้วย status code ที่เหมาะสม

| Code | ชื่อ | ความหมายตามสไลด์ |
| --- | --- | --- |
| **400** | Bad Request | client ส่ง request ไม่ถูกต้อง เช่น ขาด request body หรือ parameter ที่จำเป็น |
| **401** | Unauthorized | client ยืนยันตัวตน (authenticate) กับเซิร์ฟเวอร์ไม่สำเร็จ |
| **403** | Forbidden | ยืนยันตัวตนแล้ว แต่ไม่มีสิทธิ์เข้าถึง resource นั้น |
| **404** | Not Found | resource ที่ขอไม่มีอยู่ |
| **409** | Conflict | request ขัดแย้งกับสถานะปัจจุบันของ resource เป้าหมาย |
| **412** | Precondition Failed | เงื่อนไขใน request header อย่างน้อยหนึ่งข้อประเมินเป็นเท็จ |
| **500** | Internal Server Error | เกิดข้อผิดพลาดทั่วไปฝั่งเซิร์ฟเวอร์ |
| **503** | Service Unavailable | บริการที่ขอใช้ไม่พร้อมให้บริการ |

จำง่าย: **4xx** = ความผิดฝั่ง client (400, 401, 403, 404, 409, 412) ส่วน **5xx** = ความผิดฝั่งเซิร์ฟเวอร์ (500, 503) ตารางใน `AppError` (slide 10) มีครบ 6 ตัว: 400, 401, 403, 404, 409, 500

### Express: Error-handling Middleware slide 15

```
// error handler
app.use(function (err, req, res, next) {
    const status = err.status || 500;
    res.status(status);
    res.json( {
           error: err.code,
           statusCode: status,
           message: err.message,
           path: req.originalUrl,
           timestamp: new Date().toLocaleString()
       }
    );
});
```

| บรรทัด | ความหมาย |
| --- | --- |
| `function (err, req, res, next)` | 4 พารามิเตอร์ = Express รู้ว่าเป็น error handler |
| `const status = err.status \|\| 500` | ใช้ status จาก error ถ้ามี ไม่งั้นเป็น **500** |
| `res.status(status)` | ตั้ง HTTP status |
| `res.json({...})` | ตอบเป็น JSON 5 ฟิลด์ |

| ฟิลด์ใน JSON | ค่าที่ใส่ |
| --- | --- |
| `error` | `err.code` (รหัส error) |
| `statusCode` | `status` |
| `message` | `err.message` |
| `path` | `req.originalUrl` (URL ที่ client เรียก) |
| `timestamp` | `new Date().toLocaleString()` (เวลาที่เกิด) |

Error-handling middleware must be defined at the end, after all routes/middlewares. If no error handler is defined, Express will send a default HTML error response (with stack trace in dev mode).

ต้องประกาศ error-handling middleware **ไว้ท้ายสุด** หลัง route/middleware ทั้งหมด ถ้าไม่มี Express จะส่งหน้า error แบบ HTML เริ่มต้น (มี stack trace ในโหมด dev)

ข้อสังเกต · สไลด์ไม่สอดคล้องกันเอง `AppError` (slide 10) เก็บ status ไว้ใน `statusCode` และชื่อใน `error` แต่ error handler (slide 15) อ่าน `err.status` และ `err.code` ซึ่งตรงกับ error แบบสไลด์ 9 (`err.status = 404`, `err.code = 'FILE_NOT_FOUND'`) ถ้าส่ง `AppError` เข้า handler นี้ตรง ๆ จะได้ status **500** เสมอ เพราะ `err.status` เป็น `undefined` ต้องแก้ให้อ่าน field ชื่อเดียวกัน

ส่วนเสริม · แนวทางแก้และข้อควรจำ (สมมติ) ตัวอย่างแก้ให้รองรับทั้งสองแบบ:

```
const status = err.statusCode || err.status || 500;
```

ข้อควรจำอื่น: handler ที่มี **4 พารามิเตอร์** ต้องเขียนครบแม้ไม่ใช้ `next` เพราะ Express ดูจำนวนพารามิเตอร์ และตามสไลด์ 5 ที่ว่าด้วยข้อมูลสำคัญหลุด ควรไม่ส่ง `err.stack` ให้ client ใน production

### Practices slide 16

สไลด์ 16 เป็นหน้าคั่น "**Practices**" (มีรูปการ์ตูนคนเขียนโค้ด) ไม่มีเนื้อหาเพิ่ม ใช้เปลี่ยนเข้าสู่การฝึกปฏิบัติ

สรุป

## ภาพรวมและประเด็นสอบ

ภาพรวมที่เชื่อมกัน: error เกิดได้ทุกชั้น (Controller, Service, Repository) และ**ส่งขึ้นไปตาม call stack** (propagation) ในระดับโค้ดทั่วไปใช้ `try..catch` ส่วนใน Express ให้ `throw` หรือ `next(err)` เพื่อ**ข้ามไปยัง error-handling middleware** ตัวเดียวที่ท้ายแอป ซึ่งแปลง error เป็น **HTTP status + JSON** ที่สม่ำเสมอ โดยใช้ `AppError` ช่วยให้ error มีบริบท

### ประเด็นที่ต้องจำสำหรับสอบ

- Exception/Error = เหตุการณ์ที่ขัดจังหวะการทำงานปกติ ถ้า throw แล้วไม่ catch → Node.js ยุติ process (`process.exit(1)`) เซิร์ฟเวอร์ล่ม และ **Error is object**
- ทำไมต้องจัดการ: กันล่ม, UX ดี, ไม่ให้ stack trace รั่ว, ช่วย debug/monitor/alert
- ชนิด: **Programming Errors** (bug), **Operational Errors** (timeout, DB down, file not found), **Expected vs Unexpected**
- **Error propagation**: จับในฟังก์ชันนั้น หรือส่งต่อขึ้น call stack จนถึง global scope (อาจทำโปรแกรมหยุด)
- Error object: `message, name, stack` + ของ Node: `code` (เช่น EACCES), `errno`
- **Custom error**: `class AppError extends Error` เก็บ `statusCode, error, isOperational` และเรียก `Error.captureStackTrace`
- Middleware ลายเซ็น `(req, res, next)`: `next()` = ส่งต่อ, `res.send()/end()` = จบ
- Error-handling middleware ลายเซ็น **`(err, req, res, next)`**, `next(err)` ข้าม handler ปกติ และต้องประกาศ**ท้ายสุด**
- ถ้าไม่มี error handler → Express ส่งหน้า HTML เริ่มต้น (มี stack trace ใน dev mode)
- Status code: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 412 Precondition Failed, 500 Internal Server Error, 503 Service Unavailable
- JSON ตอบ error ในสไลด์: `error, statusCode, message, path, timestamp`

### Key Terms

**Exception / Error**เหตุการณ์ที่ขัดจังหวะการทำงานปกติ

**throw / catch**โยน error / จับ error

**try..catch**โครงสร้างจัดการ error แบบ sync

**Error propagation**ส่ง error ขึ้น call stack จนมีคนจับ

**Call stack**ลำดับการเรียกฟังก์ชัน

**Programming Error**bug / logic ผิด

**Operational Error**ปัญหาตอนรัน เช่น timeout, DB down

**Stack trace**ร่องรอยว่า error เกิดที่ไหน

**errno / code**รหัส system error (ตัวเลข / สตริง)

**Custom Error class**คลาสที่สืบทอด Error เพื่อเพิ่มบริบท

**AppError**ตัวอย่าง custom error ในสไลด์

**isOperational**ธงบอกว่าเป็น error ที่คาดการณ์ได้

**Middleware**ฟังก์ชัน (req, res, next)

**next(err)**ส่ง error ไป error handler

**Error-handling middleware**ฟังก์ชัน (err, req, res, next)

**req.originalUrl**URL เดิมที่ client เรียก

**HTTP status code**รหัสสถานะ 4xx / 5xx

**Layered System**แยกชั้น Controller / Service / Repository

ที่มา: ไฟล์ 06-INT161-Error Handling 1.pdf (INT161 Basic Backend Development, Week-06) ครบทั้ง 16 สไลด์ · โค้ด ตาราง และแผนภาพมาจากสไลด์ · กล่อง "ส่วนเสริม" (เส้นประเหลือง) คือเนื้อหาที่เพิ่มเอง ได้แก่ ภาพ call stack, ลำดับผลลัพธ์ที่คาดของสไลด์ 7, ข้อสังเกตเรื่อง AppError, ภาพรวมการไหลของ error ใน Express, เรื่อง async และแนวทางแก้ status field · กล่องแดงคือจุดที่สไลด์พิมพ์ผิดหรือไม่สอดคล้องกัน