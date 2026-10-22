INT161 · Basic Backend Development · Week-05

# Express.js Framework

ติวจากไฟล์ 05-INT161-Express-Framework 1.pdf · ครบ 17 สไลด์

สไลด์ 1–17Part A–Fศัพท์อังกฤษตัวหนา

## ภาพรวมของหัวข้อ

บทนี้แนะนำ Express.js เฟรมเวิร์กเว็บสำหรับ Node.js ที่มาแทนโค้ด `http.createServer` ที่เขียนเองในไฟล์ 01–04 เนื้อหาเริ่มจาก Express คืออะไร แนวคิดหลัก (**Routing**, **Middleware**, **Unopinionated**) การติดตั้ง เปรียบเทียบโค้ด Raw Node.js กับ Express แล้วอ่านข้อมูลจาก request ด้วย `req.params`, `req.query`, `req.body` และตอบด้วย `res.json()`, `res.status()` จากนั้นจัดโครงสร้างแบบ **Layered System** (Controller, Service, Repository) ใช้ **Express Router** และ **Middleware** ปิดท้ายด้วยการสร้างโปรเจกต์ต้นแบบ (template) ใน WebStorm

[Part Aวัตถุประสงค์และทบทวน1–3](#A) [Part BExpress คืออะไร แนวคิดหลัก การติดตั้ง4–6](#B) [Part CRaw Node.js vs Express, request และ response7–10](#C) [Part DLayered System ใน Express11–13](#D) [Part ERouting, Router และ Middleware14–16](#E) [Part FWebStorm Project Template (ESM)17](#F) [สรุปประเด็นสอบและ Key Termsท้ายไฟล์](#S)

Part A

## วัตถุประสงค์และทบทวน

slide 1–3

### Unit Objectives slide 1–2

สไลด์ 1 คือหน้าปก "**Express.js Framework**" (INT 161, Week-05) สไลด์ 2 ระบุวัตถุประสงค์ 4 ข้อ

| ข้อ | วัตถุประสงค์ (ตามสไลด์) | ตรงกับหัวข้อ |
| --- | --- | --- |
| 1 | **Create Node.js Project with Express js framework** | Part B, F (slide 6, 17) |
| 2 | **Explain basic concept of express framework** | Part B–C, E (slide 4–10, 14–16) |
| 3 | **Explain the layer system of RESTful API principle** | Part D (slide 11–13) |
| 4 | **Create basic CRUD REST API follow the layer system** | slide 15, 17 |

### ทบทวน Web Application slide 3

สไลด์ 3 ใช้แผนภาพเดิม: **Client** ส่ง **Http Request** ไปที่ **Node.js / Bun** (Application Server) ที่ต่อกับ **Database Server** และส่ง **Http Response** กลับ บทนี้เปลี่ยนวิธีเขียนส่วน Node.js ในแผนภาพนี้ให้ใช้ Express

Part B

## Express คืออะไร แนวคิดหลัก การติดตั้ง

slide 4–6

### What is Express JS? slide 4

Express is the minimalist, unopinionated, fast web framework for Node.js.

Express เป็นเว็บเฟรมเวิร์กสำหรับ Node.js ที่เล็กเรียบง่าย ไม่บังคับรูปแบบ (unopinionated) และเร็ว

- ให้ชั้น **routing** และการรัน **middleware** ที่เป็นระบบ ซ้อนอยู่บน HTTP server ที่มากับ Node.js
- ทำให้พัฒนาแอปที่รับ request หลายแบบได้ง่าย เช่น **GET, PUT, POST, DELETE**
- Express เป็นส่วน **backend** ของ **MEAN / MERN stack**

| Stack | M | E | A / R | N |
| --- | --- | --- | --- | --- |
| **MEAN** | MongoDB | Express.js | Angular.js | Node.js |
| **MERN** | MongoDB | Express.js | React.js | Node.js |

ทั้งสอง stack ต่างกันที่ฝั่ง frontend (Angular กับ React) ส่วน MongoDB, Express.js และ Node.js เหมือนกัน

### Key Concepts slide 5

| แนวคิด | อธิบายตามสไลด์ |
| --- | --- |
| **Routing** | Express มี API ตรงไปตรงมาไว้จัดการ HTTP requests (GET, POST, PUT, DELETE ฯลฯ) ตาม URL และ path |
| **Middleware** | ฟังก์ชันที่เข้าถึง **request object (req)**, **response object (res)** และฟังก์ชัน **next** ในวงจรการทำงาน |
| **Unopinionated Architecture** | มีอิสระเต็มที่ในการจัดโครงสร้างแอปและเลือก stack เอง |

งานที่ใช้ **Middleware** ทำ ตามสไลด์

- แปลง JSON request body (`express.json()`)
- **Authentication** และ **authorization**
- **Logging** และ **error handling**
- เปิดใช้ **CORS** (Cross-Origin Resource Sharing)

### Installation & Using Express slide 6

1. **Create Project** (สร้างโปรเจกต์)
2. **Install Express:** `npm install express` จะสร้างโฟลเดอร์ใน `node_modules` และติดตั้ง Express เวอร์ชัน stable ล่าสุดเข้าโปรเจกต์
3. **Specify Version:** เติม `@version` ต่อท้ายชื่อแพ็กเกจเพื่อติดตั้งเวอร์ชันที่ต้องการ
4. **Import Express:** ใช้ `import express from 'express';` เพื่อนำ Express เข้ามาในโค้ด

ส่วนเสริม · ตัวอย่างข้อ 3 สไลด์เขียนแค่ `@version` ตัวอย่าง (สมมติ) `npm install express@4.21.2` ส่วน `import` แบบ ESM ต้องตั้ง `"type": "module"` ใน package.json (ดู Part F)

สไลด์พิมพ์ผิด `import express from 'express’;` ในสไลด์มีเครื่องหมาย ’ โค้งปนอยู่ ถ้าคัดลอกต้องแก้เป็นเครื่องหมายตรง (')

Part C

## Raw Node.js vs Express, request และ response

slide 7–10

### Raw Node.js HTTP vs. Express.js slide 7

แผนภาพสองสายเทียบขั้นตอนเมื่อมี **Client Request** เข้ามา

เทียบทีละขั้นตามแผนภาพslide 7

| ขั้น | Raw Node.js (กล่องเทา) | Express.js (กล่องเขียว) |
| --- | --- | --- |
| 1 | `http.createServer` | `Express()` App |
| 2 | **Manual** Stream Chunks (อ่าน body เอง) | **Automated** Body Parsers |
| 3 | **Manual** URL & Query Parsing | **Pattern-Matched Routes** |
| 4 | **Manual** `res.writeHead` & `res.end` | Clean `res.json` / `res.send` |

การวางเทียบเป็นแถวตามลำดับขั้นในแผนภาพ ซึ่งแต่ละฝั่งมี 4 กล่องเรียงลงมา ตัวอย่างที่เห็นคือ Raw ต้องทำเองทุกขั้น (Manual) ส่วน Express ทำให้อัตโนมัติ

ไฟล์ 04 · getBodyใช้ `request.on('data')` และ `'end'` + `JSON.parse` เอง

→

Express`app.use(express.json())` แล้วอ่าน `req.body` ได้เลย

### Express.js example slide 7–8

โค้ดทางขวาของ slide 7 คือตัวอย่างเดียวกับ slide 8 (หัวข้อ "Express.js example") เป็น API แก้ไข subject ด้วย PUT

```
import express from 'express';

const app = express();
app.use(express.json()); //midle-ware

app.put('/api/subjects/:id', (req, res) => {
    const {filter, page, size} = req.query;
    const id = req.params.id;
    const subject = req.body;
    subject.id = id;
    res.json([subject, {filter: filter,
       page: page, size: size}]);
});
app.listen(3000);
```

| บรรทัด | ความหมาย |
| --- | --- |
| `const app = express()` | สร้างแอป Express |
| `app.use(express.json())` | ติดตั้ง **middleware** แปลง JSON body (สไลด์ใส่คอมเมนต์ว่า middle-ware) |
| `app.put('/api/subjects/:id', (req, res) => {...})` | ผูก handler กับ method **PUT** และ path ที่มี path parameter `:id` |
| `req.query` → `{filter, page, size}` | อ่านค่าจาก query string (เช่น `?filter=...&page=...&size=...`) |
| `req.params.id` | อ่านค่า `:id` จาก path |
| `req.body` | อ่าน JSON body ที่ถูก parse แล้ว จากนั้นใส่ `subject.id = id` |
| `res.json([subject, {filter, page, size}])` | ตอบกลับเป็น JSON ที่เป็น array ของ 2 ส่วน คือ subject และพารามิเตอร์ query |
| `app.listen(3000)` | เริ่มรับ request ที่ port 3000 |

สไลด์พิมพ์ผิด คอมเมนต์ `//midle-ware` (slide 8) ควรเป็น **middleware**

ส่วนเสริม · ผลลัพธ์ที่คาด (สมมติคำขอ) สไลด์ไม่ได้ยกคำขอหรือผลลัพธ์ ตัวอย่างสมมติ: ส่ง `PUT /api/subjects/5?filter=INT&page=1&size=10` พร้อม body `{"code":"INT 100","title":"IT Fundamentals","credit":3}` จะได้

```
[ { "code": "INT 100", "title": "IT Fundamentals", "credit": 3, "id": "5" },
  { "filter": "INT", "page": "1", "size": "10" } ]
```

ค่าจาก `req.params` และ `req.query` เป็นข้อความ (string) เสมอ จึงเห็น `"5"` และ `"1"` เป็น string

### Express request parser slide 9

Request object ให้เข้าถึงส่วนต่าง ๆ ของ HTTP request

| Property | ดึงอะไร (ตามสไลด์) | ตัวอย่างในสไลด์ |
| --- | --- | --- |
| `req.params` | ค่าพารามิเตอร์ที่ฝังใน **URL path** | `app.put('/api/subjects/:id', (req, res) => { const id = req.params.id;` |
| `req.query` | ค่าพารามิเตอร์จาก **query string** ของ URL | `const {filter, page, size} = req.query;` |
| `req.body` | **body ที่ parse แล้ว** ของ request ปกติใช้คู่กับ middleware | `const {code, title, credit} = req.body;` และ `const subject = req.body;` |

ส่วนเสริม · เทียบกับไฟล์ 02 และ 04 `req.query` แทน `new URL(...).searchParams`, `req.params` แทนการ `split('/')` ใน http-server-path.js (ไฟล์ 02) และ `req.body` แทน `getBody` (ไฟล์ 04)

### Handling Responses slide 10

| เมธอด | หน้าที่ตามสไลด์ |
| --- | --- |
| `res.json()` | แปลง JavaScript object หรือค่า เป็น **JSON string** สำหรับ response (status **200**) |
| `res.status()` | ตั้ง **HTTP status code** ก่อนส่งกลับไปให้ client |

res.status() alone does not send the response. It returns the Express res (response) object

`res.status()` อย่างเดียวไม่ได้ส่ง response มันคืน object res กลับมา จึงต่อ (chain) กับ .send(), .json() หรือ .render() เพื่อส่งจริงได้

```
res.status(201).json(subject);
```

ส่วนเสริม · เทียบกับ writeResponse ไฟล์ 04 `res.status(201).json(subject)` ทำงานเดียวกับ `writeHead(201, {'Content-Type': 'application/json'})` บวก `end(JSON.stringify(subject))` ในไฟล์ 04 slide 18

Part D

## Layered System ใน Express

slide 11–13

### Layered System slide 11

แผนภาพเหมือนไฟล์ 03–04 แต่ชั้นบนสุดเปลี่ยนเป็น **Express App** และ **Express Router**

| ชั้น | ชื่อในภาพ | ป้ายกำกับ |
| --- | --- | --- |
| 1 (บน) | **Express App** + **Express Router** (ส่งและรับ {JSON} กับ Front-End) | **Presentation / Controller** |
| 2 | **Service Layer** | **Business Logic** |
| 3 (ล่าง) | **Data Access Layer** (ต่อกับฐานข้อมูล) | **Repository** |

โค้ดทางขวาของสไลด์ คือไฟล์หลักที่เชื่อม router แต่ละตัวเข้ากับ path

```
import express from "express";

const PORT = 3000;
const app = express();
app.use(express.json());

app.use('/customers', customerRoute)
app.use('/orders', orderRouter);
app.use('/products', productRouter);
app.use('/account', accountRouter);

app.listen(PORT, () => {
    console.log(
    `Running at http://localhost:${PORT}`)
});
```

| Path prefix | Router ที่รับช่วงต่อ |
| --- | --- |
| `/customers` | `customerRoute` |
| `/orders` | `orderRouter` |
| `/products` | `productRouter` |
| `/account` | `accountRouter` |

`app.use('/path', router)` คือการแบ่งงานตามกลุ่ม resource ให้ router แต่ละตัวดูแล ทำให้ไฟล์หลักสั้น (ตรงกับกฎ resource เป็นพหูพจน์ใน URI ของไฟล์ 03)

สไลด์พิมพ์ผิด / ไม่สม่ำเสมอ ชื่อตัวแปรไม่สม่ำเสมอ: `customerRoute` กับ `orderRouter`/`productRouter`/`accountRouter` (ตัวแรกขาด "r") และเครื่องหมายคำพูดโค้ง (‘) ปนในโค้ด

### Layer System Functions (1/2): Controller และ Service slide 12

#### Controller (API Layer)

- เป็น **entry point** ของ HTTP requests (GET, POST, PUT, DELETE)
- แปลง request ที่เข้ามาเป็น object ที่ service layer ประมวลผลได้
- ส่ง HTTP response กลับ (status code + JSON body)
- **ไม่มี business logic** แค่ส่งต่อ (delegate)
- **Analogy:** เคาน์เตอร์ต้อนรับของโรงพยาบาล รับข้อมูลคนไข้แล้วพาไปหาหมอที่ถูกคน

#### Service Layer (Business Logic)

- มี **business logic** หลักของแอป
- ใช้กฎ (rules), validations, การคำนวณ
- ประสานงานระหว่าง Controller กับ Repository
- เรียกได้หลาย repositories หรือ external APIs
- **Analogy:** หมอ ตรวจ วินิจฉัย และตัดสินใจการรักษา

### Layer System Functions (2/2): Repository และตารางสรุป slide 13

#### Repository Layer (Data Access Layer)

- รับผิดชอบ **data persistence** และการดึงข้อมูล
- เป็น **abstraction** เหนือฐานข้อมูล (CRUD operations)
- **ไม่มี business logic** มีแค่การเข้าถึงข้อมูลดิบ
- **Analogy:** ห้องเก็บเวชระเบียน เก็บและค้นแฟ้มคนไข้

สรุปหน้าที่ของแต่ละ layerข้อมูลจากสไลด์ 13

| Layer | Responsibility | Should Contain | Should Not Contain |
| --- | --- | --- | --- |
| **Controller** | Handle HTTP requests/responses | Routing, mapping, validation | Business logic, DB code |
| **Service** | Business rules & process coordination | Business logic, calculations | HTTP or DB details |
| **Repository** | Data access (CRUD) | Queries, persistence | Business logic, HTTP |

ตารางนี้คือหัวใจของข้อสอบเรื่อง layer: แต่ละชั้น "ห้าม" มีอะไร (Controller ไม่มี business logic และ DB code, Service ไม่มี HTTP หรือ DB, Repository ไม่มี business logic และ HTTP)

ส่วนเสริม · ตัวอย่างงานที่ควรอยู่ชั้นไหน (สมมติ)

| งาน | อยู่ชั้น |
| --- | --- |
| อ่าน `req.params.id` และตอบ `res.status(404)` | Controller |
| เช็กว่า credit ต้องมากกว่า 0 ก่อนบันทึก | Service |
| `SELECT * FROM subjects WHERE id = ?` | Repository |

Part E

## Routing, Router และ Middleware

slide 14–16

### Routing in Express slide 14

Routing decides how an app handles client requests to a specific URL and HTTP method

Routing กำหนดว่าแอปจะจัดการ request ของ client ที่ไปยัง URL และ HTTP method เฉพาะอย่างไร

| ส่วนของ `router.METHOD(PATH, HANDLER);` | ความหมาย |
| --- | --- |
| `METHOD` | GET, POST, PUT, DELETE ฯลฯ |
| `PATH` | เส้นทาง URL ที่จะจับคู่ (เป็น string หรือ regex ได้) |
| `HANDLER` | ฟังก์ชัน `(req, res) => {...}` ที่ทำงานเมื่อจับคู่ได้ |

```
router.get('/home', (req, res) => {
    res.send('Welcome to the homepage!');
});
```

- **Route patterns** เป็น string หรือ **regex** ได้
- string ใส่ **parameters** ได้ เช่น `router.get('/api/user/:id', (req, res)` ซึ่ง `:id` คือ path parameter

สไลด์เขียนไม่ครบ ตัวอย่างสุดท้ายในสไลด์ (`router.get('/api/user/:id', (req, res)`) ยังไม่ปิดวงเล็บและไม่มี handler ครบ เป็นการแสดงรูปแบบ `:id` เท่านั้น

### Router example slide 15

routes/subject-router.js (ชื่อไฟล์เป็นสมมติ)

```
import express from "express";
import * as service from "../services/subject-service.js";
const router = express.Router();

router.get('/', async (req, res, next) => {
    const subjects = await service.getAllSubjects();
    res.json(subjects);
});
router.get('/:id', async (req, res, next) => {
    const {id} = req.params;
    const [subject] = await service.getSubjectById(id);
    if (!subject[0])
        return res.status(404).json({message: 'Subject not found'});
    res.json(subject[0]);
});
router.post('/', async (req, res, next) => {
    // call service
});
export default router;
```

| ส่วนของโค้ด | ความหมาย |
| --- | --- |
| `express.Router()` | สร้าง router แยก (ใช้แทน `app` ในไฟล์ของ resource หนึ่ง) |
| `import * as service from "../services/subject-service.js"` | Router (Controller) เรียกชั้น **Service** ไม่คุยกับ DB ตรง |
| `router.get('/', ...)` | **GET /** ดึงทุก subject (`service.getAllSubjects()`) แล้ว `res.json(subjects)` |
| `router.get('/:id', ...)` | **GET /:id** อ่าน id จาก `req.params` เรียก `service.getSubjectById(id)` ถ้าไม่พบตอบ **404** `{message: 'Subject not found'}` ถ้าพบตอบ `subject[0]` |
| `router.post('/', ...)` | เว้นไว้ให้เขียนเอง (`// call service`) เป็นงานฝึก |
| `export default router` | ส่งออก router เพื่อให้ไฟล์หลักใช้ `app.use('/api/subjects', router)` |

- ใช้ `return res.status(404).json(...)` เพื่อหยุดฟังก์ชันหลังตอบ ไม่ให้วิ่งไปส่ง response ซ้ำ
- handler เป็น `async` เพราะต้อง `await` ผลจาก service
- path `'/'` และ `'/:id'` เป็นแบบสัมพัทธ์ ส่วนนำหน้า เช่น `/api/subjects` กำหนดที่ `app.use`

ส่วนเสริม · ข้อสังเกตจากโค้ด ใน `GET /:id` สไลด์ใช้ `const [subject] = await service.getSubjectById(id)` แล้วอ่าน `subject[0]` แปลว่า service คืนผลเป็น array ซ้อน (แบบ `[rows, fields]` ของ mysql2) ซึ่งต่างจาก `findById` ในไฟล์ 04 ที่คืน array ของแถว (rows) เลย ต้องดูว่า service ที่เขียนคืนรูปแบบไหนให้ตรงกัน และพารามิเตอร์ `next` ใน handler ไม่ได้ถูกใช้ในตัวอย่างนี้ (ใช้ในหัวข้อ middleware)

### Middleware in Express slide 16

- **Middleware** เป็นขั้นตัวกลางที่ประมวลผล request **ก่อนถึง router**
- ตัวอย่าง: ตรวจ **authentication** ก่อนให้เข้าถึง admin API
- ใช้ `next()` เพื่อ **ส่งต่อการควบคุม** ไปยัง middleware ถัดไป

| ประเภท middleware (Common categories) |
| --- |
| **Application-level** Middleware |
| **Router-level** Middleware |
| **Error-handling** Middleware |
| **Built-in** Middleware |
| **Third-party** Middleware |

ตัวอย่างโค้ดในสไลด์ (วงแดงเน้น 2 บรรทัดที่ลงทะเบียน middleware)

```
import express from 'express';
const app = express();

app.use(express.json()); //midleware
app.use('/api/subjects', subjRouter);

app.listen(3000);
```

สไลด์พิมพ์ผิด ในสไลด์บรรทัดที่ 2 เขียน `app.use('/api/subjects, subjRouter);` ขาดเครื่องหมาย ' ปิดหลัง subjects (แก้แล้วในโค้ดด้านบน) และคอมเมนต์ `//midleware` สะกดผิด

ส่วนเสริม · ตัวอย่าง middleware ที่เรียก next() (สมมติ) สไลด์อธิบายแต่แนวคิด ไม่มีโค้ด middleware ที่เขียนเอง ตัวอย่างบันทึก log ทุก request แล้วส่งต่อ

```
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();   // ถ้าไม่เรียก request จะค้าง
});
```

ลำดับสำคัญ: ต้องวาง `app.use(express.json())` **ก่อน** router ที่ต้องอ่าน `req.body` เพราะ middleware ทำงานเรียงตามที่ลงทะเบียน (สอดคล้องกับสไลด์ที่บอกว่ารัน "ก่อนถึง router")

#### `app.use(express.json())`

เป็น **Built-in Middleware** ทำหน้าที่ parse JSON body (จึงใช้ `req.body` ได้)

#### `app.use('/api/subjects', subjRouter)`

เป็นการผูก **router** เข้ากับ path prefix (เรียกว่า mount) ทำให้ `router.get('/')` กลายเป็น `GET /api/subjects`

Part F

## WebStorm Project Template (ESM)

slide 17

สไลด์บอกขั้นตอนสร้างโปรเจกต์ Express แบบ ESM ใน WebStorm แล้วบันทึกเป็น template ใช้ซ้ำ

1. **Create project** (สร้างโปรเจกต์)
2. **Install modules** (ติดตั้งโมดูล เช่น `npm install express`)
3. เพิ่ม `"type": "module"` ใน **package.json**
4. **Create folders** ภายใต้ `src` ได้แก่ `configs`, `repositories`, `services`, `routes`
5. **Create Configulations file** (ไฟล์ตั้งค่า)
6. สร้าง **app.js / router / service / repository**
7. **Tools → Save project as template** ตั้งชื่อ template ว่า **Express-ESM**

โครงสร้างโฟลเดอร์ (จากสไลด์)

```
basic-rest-express/
└── src/
    ├── configs/
    ├── repositories/
    ├── services/
    └── routes/
```

package.json (ส่วนที่แสดงในสไลด์)

```
{
  "name": "basic-rest-express",
  "version": "1.0.0",
  "description": "",
  "main": "src/app.js",
  "type": "module",
  ...
}
```

| ค่าใน package.json | ความหมาย |
| --- | --- |
| `"name": "basic-rest-express"` | ชื่อโปรเจกต์ |
| `"main": "src/app.js"` | ไฟล์เริ่มต้นของแอปอยู่ที่ `src/app.js` |
| `"type": "module"` | ให้ Node.js ถือว่าไฟล์ .js เป็น **ES Modules** จึงใช้ `import/export` ได้ (ไฟล์ 02 slide 7) |

สไลด์พิมพ์ผิด "Create **Configulations** file" ควรเป็น **Configurations** และ `“type” : “module”` ในสไลด์ใช้เครื่องหมายคำพูดโค้ง ใน package.json จริงต้องใช้เครื่องหมายตรง (")

ส่วนเสริม · โฟลเดอร์ตรงกับ layer `routes/` = Controller/Router, `services/` = Service Layer, `repositories/` = Repository, `configs/` = ไฟล์ตั้งค่า (เช่น ข้อมูลเชื่อมต่อฐานข้อมูลที่ไฟล์ 04 ใส่ไว้ใน pool.js) สไลด์ไม่ได้เขียนความหมายของ configs ไว้ตรง ๆ

สรุป

## ภาพรวมและประเด็นสอบ

ภาพรวมที่เชื่อมกัน: **Express** ครอบ HTTP server ของ Node.js ให้เขียนสั้นลง ทำ **routing** (จับคู่ method + path), ใช้ **middleware** (เช่น `express.json()`) ก่อนถึง router, อ่านข้อมูลด้วย `req.params / req.query / req.body` และตอบด้วย `res.status().json()` โครงสร้างโปรเจกต์แบ่งเป็น **Router (Controller) → Service → Repository** โดยแต่ละชั้นมีสิ่งที่ควรและไม่ควรทำ

### ประเด็นที่ต้องจำสำหรับสอบ

- Express = **minimalist, unopinionated, fast** web framework for Node.js เป็นส่วน backend ของ **MEAN** (MongoDB, Express, Angular, Node) และ **MERN** (MongoDB, Express, React, Node)
- Key concepts: **Routing**, **Middleware** (เข้าถึง req, res, next), **Unopinionated Architecture**
- ติดตั้ง `npm install express` (ระบุเวอร์ชันด้วย `@version`) และ `import express from 'express'`
- Raw vs Express: Manual stream chunks → Automated body parsers, Manual URL & query parsing → Pattern-matched routes, Manual `writeHead/end` → `res.json / res.send`
- `req.params` = ค่าใน path (`:id`), `req.query` = query string, `req.body` = body ที่ parse แล้ว (ต้องมี `express.json()`)
- `res.json()` ส่ง JSON (status 200), `res.status()` ตั้ง status แต่**ไม่ส่ง** response ต้องต่อ `.json()/.send()/.render()`
- 3 layers: **Controller** (HTTP, ไม่มี business logic/DB code), **Service** (business logic, ไม่มี HTTP/DB), **Repository** (CRUD, ไม่มี business logic/HTTP) พร้อม analogy โรงพยาบาล: เคาน์เตอร์ต้อนรับ, หมอ, ห้องเวชระเบียน
- Routing syntax: `router.METHOD(PATH, HANDLER)` pattern เป็น string หรือ regex และใส่ `:id` ได้
- Middleware: ทำงานก่อนถึง router ใช้ `next()` ส่งต่อ มี 5 ประเภท: Application-level, Router-level, Error-handling, Built-in, Third-party
- ESM project: ตั้ง `"type": "module"` ใน package.json โครงสร้าง `src/configs, repositories, services, routes`

### Key Terms

**Express.js**เว็บเฟรมเวิร์กสำหรับ Node.js

**Unopinionated**ไม่บังคับโครงสร้างหรือ stack

**MEAN / MERN**stack MongoDB + Express + Angular/React + Node

**Routing**จับคู่ method + path กับ handler

**Route handler**ฟังก์ชัน (req, res) ที่ทำงานเมื่อจับคู่ได้

**Middleware**ฟังก์ชันตัวกลางที่เข้าถึง req, res, next

**next()**ส่งต่อไป middleware ถัดไป

**express.json()**middleware แปลง JSON body

**CORS**Cross-Origin Resource Sharing

**req.params**ค่าใน URL path

**req.query**ค่าใน query string

**req.body**body ที่ parse แล้ว

**res.json()**ส่ง response เป็น JSON

**res.status()**ตั้ง status code (ต้องต่อ chain เพื่อส่ง)

**express.Router()**สร้าง router แยกกลุ่ม resource

**Controller**ชั้นรับ/ตอบ HTTP

**Service Layer**ชั้น business logic

**Repository**ชั้นเข้าถึงข้อมูล

**ESM**ES Modules ตั้ง "type": "module"

**Project template**โปรเจกต์ต้นแบบที่บันทึกไว้ใน WebStorm (Express-ESM)

ที่มา: ไฟล์ 05-INT161-Express-Framework 1.pdf (INT161 Basic Backend Development, Week-05) ครบทั้ง 17 สไลด์ · โค้ด ตาราง และแผนภาพมาจากสไลด์ · กล่อง "ส่วนเสริม" (เส้นประเหลือง) คือเนื้อหาที่เพิ่มเอง ได้แก่ ตัวอย่างข้อ 3 ของการติดตั้ง, ผลลัพธ์ที่คาดของ PUT, การเทียบกับไฟล์ 02/04, ตัวอย่างงานของแต่ละ layer, ข้อสังเกตจากโค้ด router และตัวอย่าง middleware ที่เรียก next() · ชื่อไฟล์ routes/subject-router.js เป็นชื่อสมมติ · กล่องแดงคือจุดที่สไลด์พิมพ์ผิดหรือไม่ครบ