INT161 · Basic Backend Development · Week-02

# HTTP Basics

ติวจากไฟล์ 02-INT161-HttpBasics.pdf · ครบ 18 สไลด์ · HTTP Programming Basics

สไลด์ 1–18Part A–Eศัพท์อังกฤษตัวหนา

## ภาพรวมของหัวข้อ

บทนี้ลงมือเขียน **HTTP Server** ด้วย Node.js ต่อจากบทที่แล้ว เริ่มจากสถาปัตยกรรมภายในของ Node.js (**Event Queue**, **Event Loop**) โมดูลที่มาพร้อม Node.js โดยเฉพาะ `node:http` ความต่างระหว่าง **CommonJS** กับ **ES Modules** แล้วจึงเรียนวิธีอ่านข้อมูลที่ client ส่งมาทาง **query string** (`?name=...`) และ **path variable** (`/users/123`) ปิดท้ายด้วยแบบฝึกหัดตารางสูตรคูณและการเตรียม **WebStorm**

เนื้อหาในบทนี้คือฐานของ Express.js ในบทถัดไป เพราะ Express ทำงานแทนโค้ดที่เราเขียนเองด้วย `http.createServer` ในตอนนี้

[Part Aวัตถุประสงค์ของบท1–2](#A) [Part BNode.js Architecture และ Core Modules3–5](#B) [Part CHTTP Module, CJS vs ESM และ Core Classes6–9](#C) [Part DHTTP Server, Methods, URL และ Request Parameters10–15](#D) [Part Eแบบฝึกหัดและเครื่องมือ (JetBrains, WebStorm)16–18](#E) [สรุปประเด็นสอบและ Key Termsท้ายไฟล์](#S)

Part A

## วัตถุประสงค์ของบท

slide 1–2

สไลด์ 1 คือหน้าปก "**HTTP Programing Basics**" (INT 161 Basic Backend Development, Week-02) สไลด์ 2 บอก **Unit Objectives** ว่าเมื่อเรียนจบบทนี้ควรทำได้ 5 ข้อ

| ข้อ | วัตถุประสงค์ (ตามสไลด์) | ตรงกับหัวข้อ |
| --- | --- | --- |
| 1 | **Explain the HTTP protocol for Web Programming** (อธิบายโปรโตคอล HTTP) | Part B–C, slide 11 |
| 2 | **Created HTTP Server using Node.js** (สร้าง HTTP Server ด้วย Node.js) | Part C–D, slide 10 |
| 3 | **Manage Request & Response objects** (จัดการ object request และ response) | slide 8–10 |
| 4 | **Read Request parameter / Request body and path variable** | slide 12–15 |
| 5 | **Created Express.js project** (สร้างโปรเจกต์ Express.js) | slide 18 (เริ่มสร้างโปรเจกต์) และบทถัดไป |

สไลด์พิมพ์ผิด สไลด์เขียน "**HTTP Programing**" ที่ถูกคือ **Programming** และใช้ "Created ... " ในข้อ 2 และ 5 ซึ่งที่ถูกควรเป็น **Create** (หลัง "able to")

ข้อ 4 ระบุ "Request body" ด้วย แต่ตัวอย่างโค้ดในสไลด์ 10–15 อ่านได้แค่ query parameter และ path เท่านั้น ยังไม่มีโค้ดอ่าน body

Part B

## Node.js Architecture และ Core Modules

slide 3–5

### Web Application ฉบับ Node.js/Bun slide 3

แผนภาพเดิมจากบทที่แล้ว (Client → HTTP → Server → Database Server) แต่บทนี้วงสีแดงเน้นว่า **Application Server** คือ **Node.js / Bun** ที่รับ **Http Request** และส่ง **Http Response** กลับ

Client (Browser)พิมพ์ URL แล้วส่ง Http Request

→

Node.js / BunApplication Server ที่เราเขียนโค้ด

→

Database Serverเก็บข้อมูล

ขั้นตอน (1)–(5) ของแผนภาพเหมือน slide 7 ของบท Introduction (ผู้ใช้ใส่ URL → browser ส่ง request → server map URL → server ตอบ response → browser แสดงผล)

### Node.js Architecture slide 4

แผนภาพในสไลด์แสดงส่วนประกอบของ Node.js ดังนี้

| ส่วน | บทบาทตามแผนภาพ |
| --- | --- |
| **APPLICATION** | โค้ด JavaScript ของเรา ทำงานร่วมกับ **V8 (JavaScript Engine)** |
| **V8 (JavaScript Engine)** | เอนจินรัน JavaScript |
| **Node.js Bindings (Node API)** | ตัวเชื่อมระหว่างโค้ด JavaScript กับส่วนล่าง และมีกล่อง **OS Operation** |
| **LIBUV (Asynchronous I/O)** | ประกอบด้วย **Event Queue**, **Event Loop** และ **Work Threads** (File System, Network, Process) |

Event Queuerequest ที่เข้ามาถูกเก็บเรียงคิว

→

Event Loopหยิบทีละ request มาตรวจ

→

Blocking Operation → Work Threadsงานหนัก เช่น File System, Network, Process

→

Execute Callbackงานเสร็จแล้วกลับเข้า Event Loop

สไลด์สรุปการทำงานเป็น 4 ข้อ

1. **Clients** ส่ง request มายัง web server เพื่อใช้งานเว็บแอป request อาจเป็น **non-blocking** หรือ **blocking** เช่น query ข้อมูล, แก้ไขข้อมูล, ลบข้อมูล
2. Node.js รับ request ที่เข้ามาแล้วใส่เข้า **Event Queue**
3. request ถูกส่งผ่าน **Event Loop** ทีละตัว โดย Event Loop จะตรวจว่า request ง่ายพอที่ไม่ต้องใช้ทรัพยากรภายนอกหรือไม่
4. Event Loop ประมวลผล request แบบง่าย (**non-blocking operations**) เช่น **I/O Polling** แล้วส่ง response กลับไปยัง client ที่เกี่ยวข้อง

ส่วนเสริม · เชื่อมแผนภาพกับข้อความ สไลด์ข้อ 1–4 พูดถึงเฉพาะ request แบบง่าย ส่วนลูกศร **Blocking Operation** ไป **Work Threads** แล้ว **Execute Callback** กลับ เป็นสิ่งที่เห็นในแผนภาพ (งานที่ไม่ง่ายถูกส่งไปทำที่ thread แยก เพื่อให้ Event Loop ไม่ค้าง) ข้อความอธิบายส่วนนี้ไม่ได้อยู่ในสไลด์

### Node.js Core Built-in Modules slide 5

**Core modules** คือโมดูลที่มากับ Node.js ไม่ต้องติดตั้งเพิ่ม สไลด์ยกตัวที่ใช้บ่อย 10 ตัว

| Module | หน้าที่ (ตามสไลด์) |
| --- | --- |
| `fs` | File system operations |
| `http` | HTTP server and client |
| `path` | File path utilities |
| `os` | Operating system utilities |
| `events` | Event handling |
| `util` | Utility functions |
| `stream` | Stream handling |
| `crypto` | Cryptographic functions |
| `url` | URL parsing |
| `querystring` | URL query string handling |

อ้างอิง: w3schools.com/nodejs/nodejs_modules.asp และ geeksforgeeks.org/node-js/node-js-core-modules/ บทนี้ใช้หลัก ๆ คือ `http` และ `url`

Part C

## HTTP Module, CJS vs ESM และ Core Classes

slide 6–9

### Node.js HTTP Module slide 6

The built-in HTTP module in Node.js, used to create HTTP servers and make HTTP client requests

โมดูล HTTP ที่มากับ Node.js ใช้สร้าง HTTP server และส่ง HTTP client request ให้ Node.js คุยผ่านเว็บได้โดยไม่ต้องใช้ไลบรารีภายนอก

**Key Features** ตามสไลด์

- สร้าง HTTP servers เพื่อรับ request และส่ง response
- ส่ง HTTP requests ไปยัง server อื่น
- จัดการ HTTP methods ได้หลายแบบ (GET, POST, PUT, DELETE, PATCH ฯลฯ)
- ทำงานกับ request และ response **headers**
- จัดการ **streaming data** สำหรับ payload ขนาดใหญ่

#### Importing the HTTP module

ES Modules (Recommended)

```
import * as http from 'node:http';
```

CommonJS

```
const http = require('node:http');
```

#### Which one should you use?

**ใช้ ES Modules (ESM)** กับโปรเจกต์ใหม่ทั้งหมด เพราะเป็นมาตรฐานทางการของ JavaScript ในอนาคต

**ใช้ CommonJS (CJS)** เมื่อทำงานกับ codebase Node.js เก่า (legacy) ที่ถ้าย้ายแล้วจะทำให้ dependency เดิมพัง

โค้ดทุกตัวอย่างของบทนี้ (slide 10–15) ใช้ `import` แบบ ESM ต่างจากบท Introduction ที่ใช้ `require`

### CJS vs ESM slide 7

CommonJS uses require() and loads synchronously, making it the traditional Node.js standard.

CommonJS ใช้ require() และโหลดแบบ synchronous เป็นมาตรฐานดั้งเดิมของ Node.js

ES Modules use import/export, support asynchronous loading, and are the official modern web standard.

ES Modules ใช้ import/export โหลดแบบ asynchronous ได้ และเป็นมาตรฐานเว็บสมัยใหม่อย่างเป็นทางการ

| Key Difference | CommonJS (CJS) | ES Modules (ESM) |
| --- | --- | --- |
| **Syntax** | `require()` และ `module.exports` | `import` และ `export` |
| **Loading** | โหลดไฟล์แบบ **synchronous** ตอน runtime | ถูก **parse แบบ static** และโหลดแบบ **asynchronous** ได้ |
| **Environment** | สร้างมาเพื่อ server-side Node.js | ใช้ได้แบบ native ทั้งใน browsers และ Node.js |
| **Optimization** | รองรับ **tree-shaking** ได้ไม่ดี | ให้ bundler ทำ **tree-shaking** (ตัดโค้ดที่ไม่ได้ใช้) ได้ |
| **Variables** | มีตัวแปรประจำไฟล์ `__dirname` และ `__filename` | ใช้ `import.meta.url` |

อ้างอิง: w3schools.com/nodejs/nodejs_modules_esm.asp

### HTTP Module Core Classes slide 8–9

โมดูล `node:http` สร้างจาก **4 class หลัก**

1\. http.Serverslide 8

| สมาชิก | หน้าที่ |
| --- | --- |
| object ที่แทน HTTP server หนึ่งตัว |  |
| `server.listen(port, callback)` | เริ่มรับ connection ที่ port ที่กำหนด |
| `server.close(callback)` | หยุดรับ connection ใหม่ |
| Event: `'request'` | ถูกส่งออกทุกครั้งที่มี request พร้อมส่ง **IncomingMessage** และ **ServerResponse** มาให้ |

2\. http.ServerResponseslide 8

| สมาชิก | หน้าที่ |
| --- | --- |
| ถูกสร้างภายในโดย server เพื่อสร้างและส่ง response กลับไปที่ client |  |
| `response.writeHead(statusCode, headers)` | ส่ง response header |
| `response.setHeader(name, value)` | ตั้งค่า header ทีละค่า (สำหรับ implicit headers) |
| `response.write(chunk)` | ส่งส่วนหนึ่ง (chunk) ของ response body |
| `response.end(data)` | แจ้ง server ว่าส่ง response headers และ body ครบแล้ว |

3\. http.IncomingMessageslide 9

| สมาชิก | หน้าที่ |
| --- | --- |
| ถูกสร้างโดย **http.Server** หรือ **http.ClientRequest** ใช้อ่านข้อมูล request ที่เข้ามาหรือ response ที่ client ได้รับ และ implement **ReadableStream** interface |  |
| `request.method` | method ของ request เป็น string (เช่น 'GET', 'POST') |
| `request.url` | URL ของ request เป็น string |
| `request.headers` | object ที่เก็บ request headers ที่ parse แล้ว |

4\. http.ClientRequestslide 9

| สมาชิก | หน้าที่ |
| --- | --- |
| ถูกสร้างภายในเมื่อเรียก `http.request()` แทน HTTP request ฝั่ง client ที่กำลังดำเนินอยู่ |  |
| `request.write(chunk)` | ส่ง body chunk สำหรับ POST/PUT |
| `request.end()` | จบการส่ง request |
| Event: `'response'` | ถูกส่งออกเมื่อได้รับ response จาก server |

สไลด์พิมพ์ผิด ในข้อ 4 สไลด์เขียน `request.request.end()` ที่ถูกควรเป็น `request.end()`

ส่วนเสริม · วิธีจำ ฝั่ง server ได้ของมา 2 ชิ้นต่อหนึ่ง request คือ **IncomingMessage** (ตัวแปร `request` ใช้อ่าน) กับ **ServerResponse** (ตัวแปร `response` ใช้เขียน) ส่วน **ClientRequest** ใช้เมื่อโค้ดของเราเป็นฝ่ายส่ง request ไปหา server อื่น

Part D

## HTTP Server, Methods, URL และ Request Parameters

slide 10–15

### Http Server – Request and Response slide 10

http-server.js

```
import * as http from 'node:http';

const listener = function (request, response) {
    const { url, method } = request;
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end(`You made a ${method} request to ${url}`); //template literal
};

const server = http.createServer(listener);
server.listen(3000,() => {
    console.log('Server running at http://127.0.0.1:3000/');
});
server.on('request', (req, res) => {
    console.log('Request received:', req.method, req.url);
});
```

| บรรทัด | ความหมาย |
| --- | --- |
| `import * as http from 'node:http'` | โหลดโมดูล HTTP แบบ ESM |
| `const { url, method } = request` | ดึง `url` และ `method` ออกจาก request ด้วย destructuring |
| `writeHead(200, {'Content-Type': 'text/plain'})` | ส่ง status 200 และ header ว่า body เป็นข้อความธรรมดา |
| ``response.end(`...${method}...${url}`)`` | ส่ง body เป็น **template literal** (ข้อความในเครื่องหมาย backtick ที่แทรกค่าด้วย `${}`) แล้วจบ response |
| `http.createServer(listener)` | สร้าง server โดย **listener** ถูกเรียกทุก request |
| `server.listen(3000, callback)` | รับ request ที่ port 3000 แล้วเรียก callback พิมพ์ข้อความยืนยัน |
| `server.on('request', (req, res) => {...})` | เพิ่ม listener อีกตัวสำหรับ event 'request' ใช้ `console.log` บันทึกทุก request ที่เข้ามา |

สไลด์มีคำสั่ง **curl** ไว้ทดสอบ server ที่กำหนด method เป็น PUT พร้อมส่งข้อมูล

Terminal

```
curl -i -X PUT http://localhost:3000/user/5 -d '{"name": "John Doe", "role": "Admin"}'
```

ส่วนเสริม · อธิบาย curl และผลลัพธ์ที่คาด `-i` แสดง response headers ด้วย, `-X PUT` กำหนด method, `-d` ส่งข้อมูลใน body สไลด์ไม่ได้เฉลยผลลัพธ์ แต่ตามโค้ด server จะตอบ `You made a PUT request to /user/5` (Status 200) และพิมพ์ `Request received: PUT /user/5` ที่ console ของ server ซึ่งโค้ดนี้ยังไม่ได้อ่านค่าใน body

ข้อสังเกต คำสั่ง curl และ `'node:http'` ในสไลด์มีเครื่องหมายคำพูดโค้ง (’) ปนอยู่ ถ้าคัดลอกไปรันตรง ๆ ต้องแก้เป็นเครื่องหมายคำพูดตรง (')

### HTTP Methods slide 11

สไลด์สรุปตาราง Method, Purpose, Example ไว้ 4 method หลัก ตัวอย่างใช้ resource `/subjects` และ `/students`

| Method | Purpose | Example |
| --- | --- | --- |
| GET | Retrieve data from resource (ดึงข้อมูล) | `/subjects` `/students` |
| POST | Create new resource (สร้างใหม่) | `/subjects` `/students` (with data) |
| PUT | Update existing data (แก้ไขข้อมูลเดิม) | `/subjects/{id}` `/students/{id}` (with data) |
| DELETE | Remove a resource (ลบ) | `/subjects/{id}` `/students/{id}` |

POST และ PUT ส่ง "with data" (มี body) ส่วน PUT และ DELETE ระบุ resource ที่ต้องการด้วย `{id}` ใน path (เรียกว่า path variable ใน slide 15)

### Parsing URLs with the URL Module slide 12

The Node.js url module provides utilities for URL resolution, parsing, and manipulation.

โมดูล url ของ Node.js มีเครื่องมือสำหรับ resolve, parse และจัดการ URL

Node.js สมัยใหม่ใช้ **WHATWG URL API** (WHATWG = Web Hypertext Application Technology Working Group) ซึ่งทำให้ class **URL** และ **URLSearchParams** ใช้ได้เลยแบบ **global** โดยไม่ต้อง `require()`

ตัวอย่าง URL ในสไลด์ (ใช้ซ้ำใน slide 13–14)

```
http://localhost:3000/user?name=Somchai&fav_subj=Back-end Dev&fav_subj=Front-end Dec
```

| ส่วนของ URL | ค่า |
| --- | --- |
| path | `/user` |
| query string เริ่มหลัง `?` คั่นแต่ละคู่ด้วย `&` | `name=Somchai` · `fav_subj=Back-end Dev` · `fav_subj=Front-end Dec` |

key `fav_subj` ซ้ำสองครั้ง จึงต้องอ่านด้วย `getAll` ได้เป็น array

โค้ด parse URL

```
const urlObj = new URL(request.url,`http://${request.headers.host}`);
const params = urlObj.searchParams;

const name = params.get('name');
const subjects = params.getAll('fav_subj');
```

| บรรทัด | ความหมาย |
| --- | --- |
| `new URL(request.url, base)` | `request.url` มีแค่ path+query (เช่น `/user?name=...`) จึงต้องใส่ **base** เป็น `http://${request.headers.host}` เพื่อประกอบเป็น URL เต็ม |
| `urlObj.searchParams` | object **URLSearchParams** ของ query string |
| `params.get('name')` | ค่าของ key นั้น (ค่าเดียว) |
| `params.getAll('fav_subj')` | ทุกค่าของ key ที่ซ้ำ ได้เป็น **array** |

อ้างอิง: w3schools.com/nodejs/nodejs_http.asp

ข้อสังเกตเรื่องตัวอย่าง URL ท้าย URL สไลด์เขียน "**Front-end Dec**" น่าจะตั้งใจให้เป็น "Front-end Dev" (คู่กับ Back-end Dev) และ URL มีช่องว่างอยู่ ซึ่งเบราว์เซอร์จะเข้ารหัสเป็น `%20` ให้เอง ตอนอ่านด้วย `params.get` จะถูกถอดรหัสกลับเป็นช่องว่าง

### Request parameters (1): ส่งผลเป็นข้อความ slide 13

http-server.js

```
const listener = function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    const { url, method } = request;
    const urlObj = new URL(request.url,`http://${request.headers.host}`);
    const params = urlObj.searchParams;
    const name = params.get('name');
    const subjects = params.getAll('fav_subj');
    response.write(`Name = ${name} Favorite Subjects: ${subjects}\n`);
    response.end(`You made a ${method} request to ${url}`); //template literal
};
```

เรียกด้วย URL เดิม (`/user?name=Somchai&fav_subj=Back-end Dev&fav_subj=Front-end Dec`)

ส่วนเสริม · ผลลัพธ์ที่คาด (คำนวณจากโค้ด) สไลด์ไม่ได้แสดงผลลัพธ์ ตามโค้ดจะได้ข้อความ 2 บรรทัด โดย `${subjects}` ที่เป็น array จะถูกแปลงเป็นข้อความที่คั่นด้วยเครื่องหมายจุลภาค

```
Name = Somchai Favorite Subjects: Back-end Dev,Front-end Dec
You made a GET request to /user?name=Somchai&fav_subj=Back-end%20Dev&fav_subj=Front-end%20Dec
```

บรรทัดที่สองแสดง `url` ตามที่เบราว์เซอร์ส่งมา (ช่องว่างถูกเข้ารหัสเป็น %20)

### Request parameters (2): วนแสดงค่าด้วย forEach slide 14

```
const listener = function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    const { url, method } = request;
    const urlObj = new URL(request.url,`http://${request.headers.host}`);
    const params = urlObj.searchParams;
    const name = params.get('name');
    const subjects = params.getAll('fav_subj');
    response.write('Name: ' + name + '\n');
    response.write('Favorite Subjects:\n');
    subjects.forEach(function(subject, index) {
        response.write('    ' + (index+1) + ', ' + subject + '\n\n');
    });
    response.end(`You made a ${method} request to ${url}`); //template literal
};
```

ต่างจาก slide 13 ตรงที่ใช้ `subjects.forEach(function(subject, index) {...})` วนทีละรายวิชา เขียนบรรทัดละหนึ่งรายวิชา โดย `index+1` ทำให้เลขลำดับเริ่มที่ 1

ส่วนเสริม · ผลลัพธ์ที่คาด (คำนวณจากโค้ด)

```
Name: Somchai
Favorite Subjects:
    1, Back-end Dev

    2, Front-end Dec

You made a GET request to /user?name=Somchai&fav_subj=Back-end%20Dev&fav_subj=Front-end%20Dec
```

### Path variable: http-server-path.js slide 15

http-server-path.js

```
const listener = function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    const { url, method } = request;
    const urlObj = new URL(request.url,`http://${request.headers.host}`);
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    response.write('Path Segments:\n');
    pathSegments.forEach(function(pathSegment, index) {
        response.write('    ' + (index+1) + ', ' + pathSegment + '\n\n');
    });
    response.end(`urlObj.pathname: ${urlObj.pathname}`); //template literal
    console.log('path', urlObj.pathname);
};
```

แนวคิดคือแยก path ออกเป็นส่วน ๆ (**path segments**) เพื่ออ่านค่า **path variable** เช่น `/users/123` ที่ `123` คือ id สไลด์อธิบาย 2 บรรทัดสำคัญไว้ในกล่อง

| นิพจน์ | ผลตามสไลด์ |
| --- | --- |
| `pathname.split('/')` | ได้ array เช่น `["", "users", "123"]` สำหรับ `/users/123` |
| `filter(Boolean)` | รัน `Boolean(item)` กับทุก element แล้ว `filter()` เก็บเฉพาะ element ที่ callback คืนค่า true จึง**ตัด empty string ออก** |

ลำดับการทำงานกับ /users/123 (จากคำอธิบายในสไลด์)slide 15

| ขั้น | ค่า |
| --- | --- |
| pathname | `/users/123` |
| หลัง `split('/')` | `["", "users", "123"]` มี "" นำหน้า |
| หลัง `filter(Boolean)` | `["users", "123"]` ตัด "" ออกแล้ว |

ส่วนเสริม · ผลลัพธ์ที่คาด (คำนวณจากโค้ด) เมื่อเรียก `http://localhost:3000/users/123`

```
Path Segments:
    1, users

    2, 123

urlObj.pathname: /users/123
```

และ console ของ server พิมพ์ `path /users/123`

Part E

## แบบฝึกหัดและเครื่องมือ

slide 16–18

### Exercise – Multiplication table slide 16

โจทย์ในสไลด์

- รับ request parameter ชื่อ **'number'**
- ตอบกลับเป็น **ตารางสูตรคูณ** ของเลขนั้น
- ตัวอย่าง response body (ภาพในสไลด์)

ตัวอย่าง: localhost:3000/user?number=8ข้อมูลจากภาพในสไลด์

| Multiplication number for 8 |  |  |  |  |
| --- | --- | --- | --- | --- |
| 8 | x | 1 | = | 8 |
| 8 | x | 2 | = | 16 |
| 8 | x | 3 | = | 24 |
| 8 | x | 4 | = | 32 |
| 8 | x | 5 | = | 40 |
| 8 | x | 6 | = | 48 |
| 8 | x | 7 | = | 56 |
| 8 | x | 8 | = | 64 |
| 8 | x | 9 | = | 72 |
| 8 | x | 10 | = | 80 |
| 8 | x | 11 | = | 88 |
| 8 | x | 12 | = | 96 |

ตัวอย่างคูณ 1 ถึง 12 และหัวตารางเขียนว่า "Multiplication number for 8" โจทย์ใช้ path `/user` เหมือน slide 12–14 แต่เปลี่ยน key เป็น `number`

ส่วนเสริม · แนวทางทำ (สไลด์ไม่ได้เฉลย) ใช้เทคนิคจาก slide 12–13 คือ `new URL(...)` → `searchParams.get('number')` แล้ววนลูป 1–12 เขียนด้วย `response.write` ตัวอย่างเขียนเองที่ตอบเป็น HTML ตาราง

```
import * as http from 'node:http';

const listener = function (request, response) {
    const urlObj = new URL(request.url, `http://${request.headers.host}`);
    const number = Number(urlObj.searchParams.get('number'));
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(`<h3>Multiplication number for ${number}</h3><table>`);
    for (let i = 1; i <= 12; i++) {
        response.write(`<tr><td>${number}</td><td>x</td><td>${i}</td><td>=</td><td>${number * i}</td></tr>`);
    }
    response.end('</table>');
};
http.createServer(listener).listen(3000);
```

ถ้าไม่ส่ง `number` มา ค่า `get` จะเป็น null และ `Number(null)` เป็น 0 ตารางจะออกเป็น 0 ทั้งหมด ในข้อสอบควรเช็กค่าก่อนถ้าโจทย์ต้องการ

### JetBrains License slide 17

สไลด์แนะนำวิธีขอใช้ **WebStorm** (IDE ของ JetBrains) ผ่าน license server ของคณะ

1. **Register Jetbrains account with SIT email first!** ต้องสมัครบัญชี JetBrains ด้วยอีเมลของ SIT ก่อน (ข้อความสีเหลืองบนพื้นแดงในสไลด์)
2. เปิด WebStorm → หน้า **Manage Licenses** เลือกตัวเลือก **License server** (ตัวเลือกอื่นในภาพคือ Subscription และ Activation code)
3. ใส่ **Server address** เป็น `https://sit.fls.jetbrains.com` แล้วกด **Activate** (มีปุ่ม Test Connection และ Discover Server ให้ตรวจ)

สไลด์เขียน URL ซ้ำที่ท้ายหน้า (sit.fls.jetbrains.com) ภาพที่แสดงใช้บัญชี "Active until August 11, 2025" ซึ่งเป็นภาพตัวอย่างเก่า

### Test WebStorm slide 18

สไลด์สั่งให้ "**Create New Project, test**" เพื่อทดสอบว่า WebStorm ใช้ได้

| รายการในหน้า New Project | ค่าในสไลด์ |
| --- | --- |
| เมนูซ้าย (Generators) | New Project, Empty Project, Angular CLI, Bootstrap, **Express**, HTML5 Boilerplate, Next.js, **Node.js** |
| Location | โฟลเดอร์ `.../WebstormProjects/Test` (วงแดงเน้นชื่อโปรเจกต์ **Test**) |
| Create Git repository | ติ๊กไว้ |
| Language | JavaScript หรือ TypeScript |
| Generate a playground project with onboarding tips | ไม่ติ๊ก |

ในรายการ Generators มี **Express** ตรงกับวัตถุประสงค์ข้อ 5 "Created Express.js project" ในสไลด์ 2

สรุป

## ภาพรวมและประเด็นสอบ

ภาพรวมที่เชื่อมกัน: **Node.js** รับ request เข้า **Event Queue** แล้ว **Event Loop** จัดการทีละตัว เราเขียน server ด้วยโมดูล `node:http` (`createServer` + `listen`) ที่ส่ง **IncomingMessage** (request) และ **ServerResponse** (response) เข้ามาใน listener ข้อมูลจาก client อ่านได้จาก 2 ที่ คือ **query string** (ด้วย `new URL` + `searchParams`) และ **path** (ด้วย `pathname.split('/').filter(Boolean)`) และ **HTTP method** บอกว่าต้องการทำอะไรกับ resource

### ประเด็นที่ต้องจำสำหรับสอบ

- Node.js ใส่ request ลง **Event Queue** → **Event Loop** ประมวลผลทีละตัว → request ง่าย (non-blocking เช่น I/O Polling) ตอบกลับได้ทันที
- Core modules ที่ต้องรู้: `fs, http, path, os, events, util, stream, crypto, url, querystring` และหน้าที่ของแต่ละตัว
- **ESM** (`import/export`, async, tree-shaking, `import.meta.url`) vs **CJS** (`require/module.exports`, sync, `__dirname`, `__filename`) โปรเจกต์ใหม่ใช้ ESM, legacy ใช้ CJS
- 4 class ของ `node:http`: **Server, ServerResponse, IncomingMessage, ClientRequest**
- **ServerResponse**: `writeHead`, `setHeader`, `write`, `end` / **IncomingMessage**: `method`, `url`, `headers` / **Server**: `listen`, `close`, event `'request'`
- Methods: **GET** ดึง, **POST** สร้าง, **PUT** แก้, **DELETE** ลบ (PUT/DELETE ระบุ `/{id}`)
- อ่าน query ด้วย ``new URL(request.url, `http://${request.headers.host}`)`` → `searchParams.get()` (ค่าเดียว) / `getAll()` (หลายค่า)
- อ่าน path variable ด้วย `pathname.split('/')` ซึ่งได้ `["", "users", "123"]` แล้ว `filter(Boolean)` ตัด empty string
- ใช้ WebStorm ผ่าน license server `https://sit.fls.jetbrains.com` โดยสมัคร JetBrains ด้วยอีเมล SIT ก่อน

### Key Terms

**Event Queue**คิวเก็บ request ที่เข้ามา

**Event Loop**ตัววนหยิบ request มาประมวลผลทีละตัว

**libuv**ส่วน asynchronous I/O ของ Node.js

**Work Threads**thread ทำงาน blocking (file, network, process)

**non-blocking / blocking**งานที่ไม่ค้าง / งานที่ต้องรอ

**V8**JavaScript engine

**Core module**โมดูลที่มากับ Node.js

**CommonJS (CJS)**require / module.exports

**ES Modules (ESM)**import / export มาตรฐานใหม่

**tree-shaking**ตัดโค้ดที่ไม่ได้ใช้ตอน bundle

**IncomingMessage**object request ฝั่ง server

**ServerResponse**object response ฝั่ง server

**ClientRequest**request ที่โค้ดเราส่งออกไป

**template literal**ข้อความใน backtick แทรกค่าด้วย ${}

**WHATWG URL API**class URL / URLSearchParams แบบ global

**query string**ส่วนหลัง ? ของ URL

**path variable**ค่าที่อยู่ใน path เช่น /users/123

**path segments**ส่วนย่อยของ path ที่แยกด้วย /

**curl**เครื่องมือบรรทัดคำสั่งส่ง HTTP request

**WebStorm**IDE ของ JetBrains สำหรับ JavaScript

ที่มา: ไฟล์ 02-INT161-HttpBasics.pdf (INT161 Basic Backend Development, Week-02) ครบทั้ง 18 สไลด์ · โค้ด ตาราง และผลลัพธ์ในภาพสูตรคูณมาจากสไลด์ · กล่อง "ส่วนเสริม" (เส้นประเหลือง) คือเนื้อหาที่เพิ่มเอง ได้แก่ คำอธิบายแผนภาพ Node.js, วิธีจำ class, อธิบาย curl, ผลลัพธ์ที่คำนวณจากโค้ด และตัวอย่างโค้ดเฉลยสูตรคูณ · กล่องแดงคือจุดที่สไลด์พิมพ์ผิดหรือควรระวัง