INT161 · Basic Backend Development · RESTful API Development

# Introduction

ติวจากไฟล์ 2569-01-INT161-Introduction.pdf · ครบ 34 สไลด์ · ผู้สอน pichet@sit.kmutt.ac.th

สไลด์ 1–34Part A–Fศัพท์อังกฤษตัวหนา

## ภาพรวมของหัวข้อ

ไฟล์นี้เป็นบทแรกของวิชา INT161 แบ่งเป็นสามก้อนใหญ่ ก้อนแรกคือรายละเอียดวิชา เกณฑ์ประเมิน และตารางเรียน ก้อนที่สองคือพื้นฐานเว็บแอปพลิเคชัน ได้แก่ **HTTP Request/Response**, สถาปัตยกรรม **MPA** กับ **SPA**, **JSON**, **Full Stack Developer** และ **Web Services** (SOAP กับ REST) ก้อนสุดท้ายคือแนะนำ Node.js ว่าคืออะไร ต่างจากภาษาที่ compile และ interpret อย่างไร วิธีติดตั้ง และเขียนเว็บเซิร์ฟเวอร์ตัวแรกด้วยโมดูล `node:http`

เรื่องเหล่านี้เป็นฐานของทั้งวิชา เพราะบทถัดไปทุกบท (Express, Database, Prisma, DTO, JWT) สร้างบนความเข้าใจว่า client กับ server คุยกันผ่าน HTTP อย่างไร และ backend ทำหน้าที่ส่ง JSON ให้ frontend

[Part Aรายละเอียดวิชา การประเมิน ตารางเรียน1–5](#A) [Part BWeb Application และ HTTP6–11](#B) [Part Cสถาปัตยกรรม MPA, MVC, SPA และ JSON12–15](#C) [Part DFull Stack Developer และ Roadmaps16–19](#D) [Part EWeb Services: SOAP กับ REST20](#E) [Part FNode.js21–34](#F) [สรุปประเด็นสอบและ Key Termsท้ายไฟล์](#S)

Part A

## รายละเอียดวิชา การประเมิน ตารางเรียน

slide 1–5

### ชื่อวิชาและคำอธิบาย slide 1–2

วิชา **INT 161 Basic Backend Development** (การพัฒนาแบ็กเอนด์พื้นฐาน) ชื่อรองคือ **RESTful API Development** เนื้อหาตามคำอธิบายวิชา คือ

- **Basic RESTful API** (ความรู้เบื้องต้นเกี่ยวกับ RESTful API)
- **Connection with Database** (การเชื่อมต่อกับฐานข้อมูล)
- **API Authentication and Security** (API ระบุตัวตนและความปลอดภัย)
- **Sorting, Pagination and Filtering** (การเรียงลำดับ แบ่งข้อมูลออกเป็นหน้า และกรองข้อมูล)

### PLO ทั้ง 5 ระดับ slide 2

**PLO** (Program Learning Outcome) ในสไลด์แบ่งระดับการพัฒนาของผู้เรียนเป็น 5 ระดับ

| ตัวย่อ | ระดับ | ความหมายตามสไลด์ |
| --- | --- | --- |
| I | **Introduce** | ระดับแนะนำ |
| E | **Expand** | ต่อยอดจากองค์ความรู้/ทักษะเดิมที่พัฒนามาก่อนหน้า (INT141, INT150) |
| S | **Strengthen** | มีความชำนาญมากขึ้น |
| C1 | **Competence Level 1** | สมรรถนะเชิงกว้างที่คาดหวังของบัณฑิตของหลักสูตร |
| C2 | **Competence Level 2** | ผู้เรียนแสดงสมรรถนะเชิงลึกที่เฉพาะเจาะจงในสายอาชีพที่เลือก |

PLO ที่วิชานี้รับผิดชอบคือ 2C-I; 2D-E; 2F-E; 5BE-I; 5FS-I อ่านเป็น "รหัส PLO – ระดับ"

| PLO | ระดับ | ความหมาย |
| --- | --- | --- |
| **2C** | I | ออกแบบองค์ประกอบทางด้านเทคโนโลยีสารสนเทศที่สนองความต้องการทางธุรกิจได้ |
| **2D** | E | พัฒนาองค์ประกอบทางด้านเทคโนโลยีสารสนเทศตามที่ได้กำหนดไว้ได้ |
| **2F** | E | ทดสอบองค์ประกอบและการเชื่อมต่อขององค์ประกอบทางด้านเทคโนโลยีสารสนเทศได้อย่างครบถ้วนบนข้อจำกัดที่มีได้ |
| **5BE** | I | ออกแบบและพัฒนาเว็บแอปพลิเคชันส่วนแบ็กเอนด์ที่ใช้ในระดับองค์กรได้ |
| **5FS** | I | ออกแบบและพัฒนาเว็บแอปพลิเคชันที่ใช้ในระดับองค์กร ทั้งส่วนฟรอนเอนด์และแบ็กเอนด์ได้ |

ระดับ **E** (Expand) ของ 2D และ 2F ต่อยอดจากวิชา INT141 และ INT150 ส่วน 5BE กับ 5FS เป็นระดับ **I** (แนะนำ)

### การประเมินผลและแหล่งเรียนรู้ slide 3

| การสอบ | สัดส่วน | รูปแบบ |
| --- | --- | --- |
| 2nd Exam (Theory) | **30%** | **Multiple choices, single choose** (ปรนัย เลือกคำตอบเดียว) และ **Describe** (อธิบาย) |
| 2nd Exam (Practice) | **20%** | **Write a program to solve the problem** (เขียนโปรแกรมแก้โจทย์) |
| 3rd Exam (Theory) | **30%** | Multiple choices, single choose |
| 3rd Exam (Practice) | **20%** | Write a program to solve the problem |
| รวม | 100% | ทฤษฎี 60% + ปฏิบัติ 40% |

สไลด์แสดงการสอบ 2nd กับ 3rd เท่านั้น ส่วน 1st Examination ปรากฏในตารางเรียน (slide 4–5) แต่สไลด์ไม่ได้ระบุสัดส่วน

**Resources** ที่สไลด์แนะนำ

- nodejs.org/en/learn/getting-started/introduction-to-nodejs
- w3schools.com/nodejs/default.asp
- tutorialspoint.com/nodejs/index.htm
- restfulapi.net
- restful-api.dev

### ตารางเรียน Group B (พฤหัสบดี) และ Group A (ศุกร์) slide 4–5

เนื้อหาตรงกันทั้งสองกลุ่ม ต่างกันที่วันเรียน (Group A เรียนหลัง Group B หนึ่งวัน)

ครั้งที่ 1–10 · ก่อนสอบ 2ndข้อมูลจากสไลด์

| No. | Topic | Group B (พฤ.) | Group A (ศ.) |
| --- | --- | --- | --- |
| 1 | Introduction | 6 Aug 2026 | 7 Aug 2026 |
| 2 | Node.js vs Bun | 13 Aug | 14 Aug |
| 3 | RESTful API | 20 Aug | 21 Aug |
| 4 | Express framework | 27 Aug | 28 Aug |
| 5 | Connection to Database | 3 Sep | 4 Sep |
| – | 1st Examination | 7–11 Sep 2026 (ทั้งสองกลุ่ม) |  |
| 6 | Relationship Modeling / ORM | 17 Sep | 18 Sep |
| 7 | Prisma ORM | 24 Sep | 25 Sep |
| 8 | Validation & Error Handling | 1 Oct | 2 Oct |
| 9 | Data Transfer Object (DTO) | 8 Oct | 9 Oct |
| 10 | Filtering, Sorting & Pagination | 15 Oct | 16 Oct |
| – | 2nd Examination | 19–26 Oct 2026 |  |

ครั้งที่ 11–14 · ก่อนสอบ 3rdข้อมูลจากสไลด์

| No. | Topic | Group B (พฤ.) | Group A (ศ.) |
| --- | --- | --- | --- |
| 11 | JWT : Jason Web Tokens | 5 Nov 2026 | 6 Nov |
| 12 | Authentication / Authorization | 12 Nov | 13 Nov |
| 13 | Integrated Project Support Topic | 19 Nov | 20 Nov |
| 14 | Integrated Project Support Topic | 26 Nov | 27 Nov |
| – | 3rd Examination | 30 Nov – 11 Dec 2026 (สไลด์เขียน "30-11 Dec") |  |

สไลด์พิมพ์ผิด / ควรระวัง สไลด์เขียน **"JWT : Jason Web Tokens"** ที่ถูกคือ **JSON Web Token** (JSON เหมือนใน Part C) ส่วนแถวสอบ 1st ในสไลด์เขียนว่า "7 -11 Sep 2026" เป็นช่วงวันสอบ ไม่ใช่ครั้งที่ 7 ของการเรียน (ครั้งที่ 7 คือ Prisma ORM)

แต่ละกลุ่มมีวันเรียน 14 ครั้ง สอบ 3 รอบ หัวข้อที่เกี่ยวกับการสอบ 2nd (Theory + Practice) คือครั้งที่ 6–10 ภายหลังสอบ 1st

Part B

## Web Application และ HTTP

slide 6–11

### Introduction to Web Application slide 6

สไลด์ 6 เป็นหน้าคั่นหัวข้อ "**Introduction to Web Application**" พร้อมอีเมลผู้สอน (pichet@sit.kmutt.ac.th) ยังไม่มีเนื้อหา เนื้อหาเริ่มที่ HTTP ในสไลด์ถัดไป

### HTTP Protocol: client กับ server คุยกันอย่างไร slide 7

แผนภาพในสไลด์ 7 แสดงวงจรของการเปิดเว็บเป็น 5 ขั้นตอน

1. **User issues URL from a browser** (ผู้ใช้พิมพ์ URL ในเบราว์เซอร์) รูปแบบ `http://host:port/path/file`
2. **Browser sends a request message** (เบราว์เซอร์ส่ง request) เช่น `GET URL HTTP/1.1` ตามด้วย `Host: host:port`
3. **Server maps the URL to a file or program under the document directory** (เซิร์ฟเวอร์แปลง URL ไปเป็นไฟล์หรือโปรแกรมใต้โฟลเดอร์เอกสาร)
4. **Server returns a response message** (เซิร์ฟเวอร์ส่ง response กลับ) เช่น `HTTP/1.1 200 OK`
5. **Browser formats the response and displays** (เบราว์เซอร์จัดรูปแบบและแสดงผล)

ฝั่งซ้ายคือ **Client (Browser)** ฝั่งขวาคือ **Server (@ host:port)** ตรงกลางคือ **HTTP (Over TCP/IP)** สไลด์อ้างอิง w3schools.com/whatis/whatis_http.asp

### Web Application: สามส่วนหลัก slide 8

Clientส่ง **Http Request**

→

Application Serverประมวลผล แล้วส่ง **Http Response** กลับ

→

Database Serverเก็บข้อมูล Application Server เรียกใช้

แผนภาพมีเส้นแสดง request ขาไป และ response ขากลับระหว่าง client กับ Application Server เท่านั้น Application Server คุยกับ Database Server เอง

### World Wide Web Communication slide 9

HTTP stands for Hyper Text Transfer Protocol

HTTP ย่อมาจาก Hyper Text Transfer Protocol

Communication between client computers and web servers is done by sending HTTP Requests and receiving HTTP Responses

การสื่อสารระหว่างเครื่อง client กับ web server ทำโดยการส่ง HTTP Request และรับ HTTP Response

- **WWW** คือเรื่องการสื่อสารระหว่าง **web clients** กับ **servers**
- **Clients** ส่วนใหญ่คือเบราว์เซอร์ (Chrome, Edge, Safari) แต่เป็นโปรแกรมหรืออุปกรณ์ชนิดใดก็ได้
- **Servers** ส่วนใหญ่คือคอมพิวเตอร์บน cloud

### HTTP Request Structure slide 10

ข้อมูลใน request เก็บและส่งได้ **3 ตำแหน่ง** แต่ละตำแหน่งมีความสามารถและข้อจำกัดต่างกัน คือ **HTTP Headers**, **HTTP Methods** และ **HTTP Bodies**

ตัวอย่างในสไลด์: method POST ไปที่ `http://demo.codingnomads.co:8080/tasks_api/tasks` และตัวอย่างข้อความ request ที่แยกส่วนดังนี้

Request LineRequest Headersบรรทัดว่างRequest Message Body

`POST /test.html HTTP/1.1`Request Line

`Host: www.test101.com`Request Headers

`Accept: image/gif, image/jpeg, */*`Request Headers

`Accept-Language: en-us`Request Headers

`Accept-Encoding: gzip, deflate`Request Headers

`User-Agent: Mozilla/4.0`Request Headers

`Content-Length: 35`Request Headers

A blank line separates header & body

`bookId=12345&author=Tan+Ah+Teck`Request Message Body

**Request Line** + **Request Headers** รวมกันเรียกว่า **Request Message Header** บรรทัดว่างหนึ่งบรรทัดคั่นระหว่าง header กับ body (path ในสไลด์ถูกตัดบางส่วน แสดงเป็น `/test.html`)

### HTTP Response Structure slide 11

Every HTTP response follows a structured layout consisting of three main parts

ทุก HTTP response มีโครงสร้าง 3 ส่วนหลัก คือ Status Line (บรรทัดแรก), Http Header และ Message Body (Payload)

Status LineHttp HeaderMessage Body (Payload)

`HTTP/1.1 200 OK`Status Line

`Date: Wed, 05 Aug 2026 20:30:00 GMT`Header

`Server: Apache/2.4.41 (Unix)`Header

`Content-Type: text/html; charset=UTF-8`Header

`Content-Length: 138`Header

`Connection: close`Header

บรรทัดว่าง

`<!DOCTYPE html>`Body

`<html><head><title>Hello World</title></head>`Body

`<body><h1>Welcome to my website!</h1></body></html>`Body

สไลด์ไฮไลต์ Status Line สีเหลือง, header สีฟ้า, body สีเขียว (ที่นี่ย่อ HTML body ให้อยู่ในสองบรรทัด) ตัวอย่าง `200 OK` ใช้ซ้ำใน Part F ที่ `writeHead(200, …)`

ส่วนเสริม · เปรียบเทียบ Request กับ Response สไลด์ไม่มีตารางนี้ เรียบเรียงเองเพื่อจำง่าย

|  | Request | Response |
| --- | --- | --- |
| บรรทัดแรก | Request Line (method + path + version) | Status Line (version + status code) |
| ส่วนถัดมา | Request Headers | Http Header |
| คั่น | บรรทัดว่าง | บรรทัดว่าง |
| ส่วนท้าย | Request Message Body | Message Body (Payload) |

Part C

## สถาปัตยกรรม MPA, MVC, SPA และ JSON

slide 12–15

### Multi-Page Application (MPA) slide 12

A Multi-Page Application (MPA) Web Application is a traditional web application architecture where each new page or view is loaded from the server with a full page refresh.

MPA คือสถาปัตยกรรมเว็บแบบดั้งเดิม ทุกครั้งที่เปลี่ยนหน้าหรือ view จะโหลดจากเซิร์ฟเวอร์ใหม่ด้วยการรีเฟรชทั้งหน้า

แผนภาพ MPA: **Client** ส่ง **http request** ผ่าน **Web/Http Server** เข้า **Application Server** ภายในมีส่วนประกอบดังนี้ แล้วส่ง **HTML** สำเร็จรูปกลับเป็น **http response**

Application Server

url mapping / Routerจับคู่ URL กับ handler

→

Controllerควบคุมลำดับการทำงาน

↔

Data Access Engineคุยกับ Database

Modelข้อมูลที่ใช้

→

View Template Engineเอา Model ไปเติมลงแม่แบบ ได้ **HTML**

ลำดับเต็ม: Client → Web/Http Server → Router → Controller → Data Access Engine ↔ Database Server จากนั้น Model ถูกส่งให้ View Template Engine สร้าง HTML และส่งย้อนกลับทางเดิมไปที่ Client (ดาวสีชมพูในสไลด์เน้นว่า response เป็น **HTML**)

### MVC Web Application Architectures (modern / SPA) slide 13

แผนภาพคล้าย MPA แต่ต่างกันสองจุด จุดแรกคือฝั่ง Client มี **Front-End** เป็น **HTML/CSS/JavaScript Framework** ของตัวเอง จุดที่สองคือ Application Server **ไม่มี View Template Engine** แล้ว response เป็น **{JSON}** แทน HTML

ClientFront-End: HTML / CSS / JavaScript Framework

→

XMLHttpRequestขา request

→

Web/Http Server → Application ServerRouter → Controller → Model / Data Access Engine → Database

→

HttpResponseส่ง **{JSON}** กลับ

### SPA – Single Page Application slide 14

แผนภาพ SPA แยก Client Side / Server Sideslide 14

| ลำดับ | Client Side | สื่อสาร | Server Side |
| --- | --- | --- | --- |
| 1 | **Web Browser** | **initial request** ขาไป และ **HTML** ขากลับ | **Front-End**: HTML + CSS + JavaScript |
| 2 | **Web Browser** | **AJAX** ขาไป และ **{JSON}** ขากลับ | **Back-End**: RESTful API / Microservice ↔ **DB** |
| 3 | **Mobile App** | **AJAX** ขาไป และ **{JSON}** ขากลับ | Back-End ตัวเดียวกัน |

จุดสำคัญคือ Back-End ตัวเดียวให้บริการได้ทั้ง Web Browser และ Mobile App เพราะส่งเป็น JSON ไม่ผูกกับหน้าเว็บ Web Browser ขอ HTML ครั้งแรกครั้งเดียว (initial request) หลังจากนั้นคุยด้วย AJAX/JSON

#### MPA

- ทุกหน้าโหลดจากเซิร์ฟเวอร์ใหม่ (full page refresh)
- เซิร์ฟเวอร์สร้าง **HTML** ด้วย View Template Engine
- Response คือ HTML

#### SPA (modern)

- โหลด HTML ครั้งแรกครั้งเดียว
- Front-End ดึงข้อมูลผ่าน **XMLHttpRequest / AJAX**
- Response คือ **JSON** จาก RESTful API

ตารางเปรียบเทียบสองกล่องนี้เรียบเรียงจากสไลด์ 12–14 ไม่ใช่ตารางที่อยู่ในสไลด์

ส่วนเสริม · หน้าที่ของ M-V-C สไลด์แสดงเพียงชื่อกล่อง (Router, Controller, Model, View) ความหมายด้านล่างเป็นความรู้ทั่วไป: **Model** คือข้อมูลและกฎของข้อมูล, **View** คือส่วนแสดงผล, **Controller** รับคำสั่งแล้วประสาน Model กับ View ใน SPA ส่วน View ย้ายไปอยู่ที่ Front-End ทำให้ฝั่ง server เหลือ Router, Controller, Model ที่ตอบเป็น JSON

### JSON : JavaScript Object Notation slide 15

JSON is a lightweight data-interchange format.

JSON คือรูปแบบแลกเปลี่ยนข้อมูลที่เบา

- Easy for humans to read and write (คนอ่านเขียนง่าย)
- Easy for machines to parse and generate (เครื่องแปลงและสร้างง่าย)
- อิงจากส่วนย่อยของ JavaScript ตามมาตรฐาน **ECMA-262 3rd Edition (December 1999)**
- เป็น **text format** ที่ไม่ขึ้นกับภาษาโปรแกรม (**language independent**) แต่ใช้แบบแผนที่โปรแกรมเมอร์ตระกูลภาษา C คุ้นเคย เช่น C, C++, C#, Java, JavaScript, Perl, Python

แหล่งอ้างอิงในสไลด์: json.org และ education.launchcode.org (บท fetch-json) ตัวอย่าง JSON ที่ปรากฏในสไลด์ภายหลังคือ `{"name":"John Doe"}` (slide 34)

สไลด์พิมพ์ผิด หัวสไลด์เขียน **"JavaSrcipt"** ที่ถูกคือ **JavaScript**

Part D

## Full Stack Developer และ Roadmaps

slide 16–19

### Full Stack Developer: แผนภาพรวม slide 16

แผนภาพแบ่งเป็น **Client Side** กับ **Server Side** (เส้นประแดงคั่น) สไลด์แสดงการต่อเชื่อมของ client แต่ละแบบเข้ากับ server

| Client Side | เทคโนโลยีที่สไลด์แสดง | เชื่อมไปที่ |
| --- | --- | --- |
| **xPlatform Mobile App** | Flutter, React Native | **Web API** (Microservice) |
| **Classic** | เบราว์เซอร์ธรรมดา | **WebApp (Classic)** แล้วต่อไป Database |
| **SPA WebApp** (JS Framework) | Vue.js, React, Angular | **Web API** (Microservice) |

| Server Side | ต่อกับ |
| --- | --- |
| **WebApp (Classic)** | **Database** |
| **Web API** (Microservice) | **Database** และ **EIS: Enterprise Info. System** |

แถบล่างสุดของสไลด์ระบุเทคโนโลยีที่ใช้ในแต่ละฝั่ง

| ฝั่ง | เทคโนโลยีในภาพ |
| --- | --- |
| Client | HTML5, CSS3, JavaScript |
| Server (ภาษา/เฟรมเวิร์ก) | Java, PHP (Laravel), Node.js (Adonis), Python (Django) |
| ข้อมูลและบริการ | **REST**, **NoSQL**, **SQL** และสัญลักษณ์ **DevOps** |

### Full Stack Web Developer slide 17

A full stack web developer is a person who can develop both client and server software.

Full stack web developer คือคนที่พัฒนาได้ทั้งซอฟต์แวร์ฝั่ง client และฝั่ง server

| ต้องเขียนได้ | ตัวอย่างในสไลด์ |
| --- | --- |
| โปรแกรมเบราว์เซอร์ (**browser**) | JavaScript, jQuery, Angular, Vue |
| โปรแกรมเซิร์ฟเวอร์ (**server**) | Java, PHP, ASP, Python, NodeJS |
| โปรแกรมฐานข้อมูล (**database**) | SQL, SQLite, MongoDB |

อ้างอิงจาก w3schools.com/whatis/whatis_fullstack.asp

### Web Development Roadmaps slide 18–19

#### Front-End Roadmap (slide 18)

- ทุก Web Developer ต้องเข้าใจพื้นฐาน **HTML, CSS, JavaScript**
- **Responsive Web Design** ใช้ในเว็บสมัยใหม่ทุกประเภท
- **ECMAScript 5** (JavaScript 5) ใช้ได้ในเบราว์เซอร์สมัยใหม่ทุกตัว
- ฝั่ง CSS ควรเลือก framework: Bootstrap / Material Design / W3.CSS / Tailwind
- ฝั่ง JavaScript ควรเรียนอย่างน้อยหนึ่ง framework: React.js / Angular.js / Vue.js / W3.JS

#### Back-End Roadmaps (slide 19)

- **SQL / NoSQL**
- Language: Java / PHP / ASP, C# / Python / Node.js
- Framework: Spring Boot / Laravel / .NET / Django / Adonis, **Express+Prisma**
- **Web Service**
- **Microservice**

**Express+Prisma** คือ stack ที่วิชา INT161 ใช้สอน (ดูตารางเรียน: Express framework ครั้งที่ 4, Prisma ORM ครั้งที่ 7)

Part E

## Web Services: SOAP กับ REST

slide 20

สไลด์แบ่ง **Web Services** เป็น 2 ประเภท

|  | SOAP Web Services | RESTful Web Services |
| --- | --- | --- |
| ชื่อเต็ม | **Simple Object Access Protocol** | **REST** (สไลด์ไม่ได้เขียนชื่อเต็ม) |
| รูปแบบข้อมูล | กำหนดมาตรฐาน **XML** format | ใช้หลักการที่มีอยู่แล้วใน HTTP |
| การอธิบาย service | ใช้ **WSDL** (Web Service Definition Language) อธิบายรูปแบบ XML ของ request และ response | อธิบาย service โดยใช้หลักการต่าง ๆ ของ HTTP |
| ผู้สร้าง | – | **Roy Thomas Fielding** (ผู้สร้าง HTTP ด้วย) |
| วัตถุประสงค์ | กำหนดมาตรฐาน XML และวิธีสร้าง web service | เพิ่มประสิทธิภาพของ online services |

REST is a design approach, not a protocol.

REST เป็นแนวทางการออกแบบ ไม่ใช่โปรโตคอล (ข้อนี้ถูกถามง่าย: SOAP เป็น protocol ส่วน REST ไม่ใช่)

Part F

## Node.js

slide 21–34

### What is Node.js? slide 21–22

สไลด์ 21 เป็นหน้าคั่น "Introduction to Node.js: Understanding the Basics of node.js" ส่วนสไลด์ 22 บอกว่า Node.js คืออะไร

Node.js is not a programming language

Node.js ไม่ใช่ภาษาโปรแกรม

Node.js is a runtime that converts JavaScript code into machine code.

Node.js คือ runtime ที่แปลงโค้ด JavaScript ให้เป็น machine code

- เป็น **open source server environment** และ **free**
- รันได้บนหลายแพลตฟอร์ม: Windows, Linux, Unix, Mac OS ฯลฯ
- ใช้ **JavaScript** บนฝั่ง server

JavaScript Source Code (.js)ไฟล์เดียว

→ Interpreting

Node.jsบน **Windows**

Node.jsบน **Mac**

Node.jsบน **Unix/Linux**

แผนภาพใช้โค้ด .js ชุดเดียวกัน ให้ Node.js บนแต่ละ OS ตีความ (Interpreting) จึงเขียนครั้งเดียวรันได้หลายเครื่อง

### Compilation / Interpreter / Hybrid slide 23–26

สไลด์ 23–25 ใช้โปรแกรม Python ตัวอย่างชุดเดียวกันเปรียบเทียบการแปลภาษา (โปรแกรมหาเลขคู่/คี่)

ตัวอย่างโค้ดจากสไลด์ (Python)

```
x = input("x = ")
mod2 = int(x)%2
if mod2 == 0 :
    xtype = "even"
else:
    xtype = "even"
print(f"{x} is {xtype}")
```

สไลด์พิมพ์ผิด บรรทัดหลัง `else:` สไลด์เขียน `xtype = "even"` เหมือนบรรทัดบน ที่ถูกควรเป็น `xtype = "odd"` (สไลด์ใช้โค้ดนี้เป็นตัวอย่างการแปลภาษาเท่านั้น ไม่กระทบเนื้อหา)

#### 1) Compilation: ภาษา C, C++, Go slide 23

Compile Time

Source codeโค้ดต้นฉบับ

→

Compiler1. **Read all** Statement\
2\. Translate to native machine code + **Extra step**

→

Run Time

Executable Fileไฟล์ machine code

→

CPUExecuting

#### 2) Interpreter slide 24

Run Time ทั้งหมด

Source codeโค้ดต้นฉบับ

→

Interpreter1. **Read a Statement**\
2\. Translate to native machine code\
**Repeat next line until end of program**

→

Machine codeทีละส่วน

→

CPUExecute machine code

#### 3) Hybrid: Java, Kotlin, Groovy, C# (.NET) slide 26

Compile Time

Source code

→

Compiler1. Read all Statement\
2\. Translate to **byte code**

→

Run Time

Byte code File

→

VM / Runtime Env (Interpreter + JIT)1. Read a byte code\
2\. Translate to native machine code\
Repeat until end of program

→

CPUExecuting

Hybrid คือ compile เป็น **byte code** ก่อนครั้งเดียว แล้วให้ **VM/Runtime Environment** (Interpreter + **JIT**) แปลเป็น machine code ตอนรัน ได้ทั้งความพร้อมรันของ compile และความพกพาของ interpret

### Compilation vs Interpretation slide 25

| หัวข้อ | Compilation | Interpretation |
| --- | --- | --- |
| **1. Translation Timing and Workflow** | **Compiler** ตรวจทั้งโปรแกรมหาข้อผิดพลาดและแปลเป็น binary executable ล่วงหน้าครั้งเดียว มีขั้นตอนเพิ่มตอนพัฒนา แต่ได้โปรแกรมที่พร้อมรันเองได้ | **Interpreter** แปล "on the fly" ตอน runtime และรันทีละบรรทัดทันที พัฒนาเร็วและ debug ง่ายเพราะไม่ต้องรอ compile |
| **2. Performance and Speed** | รัน**เร็วกว่า** เพราะ CPU รัน machine code ที่ optimize แล้วโดยตรง | โดยทั่วไป**ช้ากว่า** เพราะการแปลเกิดพร้อมการรัน เสีย overhead ทุกครั้งที่รัน |
| **3. Portability vs. Privacy** | executable มักสร้างเฉพาะ OS และสถาปัตยกรรมซีพียูหนึ่ง จึง**พกพาได้น้อยกว่า** แต่**ซ่อน source code** ได้ เพราะแจกแค่ไฟล์ binary | **พกพาข้ามแพลตฟอร์มได้ดีมาก** ใช้ source เดียวกันกับเครื่องที่มี interpreter แต่ต้องแจก source จึง**มองเห็นได้สาธารณะ** |

ส่วนเสริม · ตารางสรุปสั้น (จำสอบ)

|  | Compile | Interpret | Hybrid |
| --- | --- | --- | --- |
| ภาษาตัวอย่างในสไลด์ | C, C++, Go | (Node.js/JavaScript ในสไลด์ 22) | Java, Kotlin, Groovy, C# |
| แปลเมื่อไร | ก่อนรัน ทั้งโปรแกรม | ตอนรัน ทีละบรรทัด | compile เป็น byte code แล้ว VM แปลตอนรัน |
| ความเร็ว | เร็ว | ช้ากว่า | (สไลด์ไม่ได้ระบุ) |

### Why Learn Node.js? slide 27

Node.js can be used to full fill multiple purpose like server-side programming, build APIs, etc.

Node.js ใช้ได้หลายวัตถุประสงค์ เช่น เขียนโปรแกรมฝั่ง server และสร้าง API

1. **Server-side programming ด้วย JavaScript** ใช้ภาษาเดียว (JavaScript) ได้ทั้ง front-end และ back-end
2. **Asynchronous execution** ใน **single thread** ด้วยเทคนิค **async** และ **await** สไลด์ระบุว่าทำให้แอป Node.js เร็วกว่าแอปแบบ **multi-threaded** อย่างมีนัยสำคัญ
3. สร้างได้ทั้ง **command line applications**, **web applications**, **real-time chat applications**, **REST APIs** ฯลฯ

### How to Install Node.js? slide 28

สไลด์ใช้ **nvm** (Node Version Manager) ติดตั้ง Node.js เวอร์ชัน 22 และแนะนำเว็บทางการ nodejs.org

Terminal

```
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"
# Download and install Node.js:
nvm install 22
# Verify the Node.js version:
node -v   # Should print "v22.14.0"
nvm current   # Should print "v22.14.0"
# Verify npm version:
npm -v    # Should print "10.9.2"
```

| คำสั่ง | หน้าที่ |
| --- | --- |
| `nvm install 22` | ติดตั้ง Node.js เวอร์ชัน 22 |
| `node -v` | ตรวจเวอร์ชัน Node.js (สไลด์ระบุ v22.14.0) |
| `nvm current` | แสดงเวอร์ชันที่ nvm ใช้อยู่ตอนนี้ |
| `npm -v` | ตรวจเวอร์ชัน npm (สไลด์ระบุ 10.9.2) |

### What is a Node.js File? slide 29

- ไฟล์ Node.js คือโค้ดที่รันบน server นามสกุลปกติ **.js** (หรือ **.ts** สำหรับ TypeScript) เริ่มรันด้วยคำสั่ง `node`
- รันงานเมื่อเกิด **events** บางอย่าง (เช่น web request)
- ต้องถูก **start บน server** จึงจะมีผล
- ใช้ไวยากรณ์ **JavaScript**

Terminal

```
> node app.js
```

### ตัวอย่างโปรแกรมแรก: myfirst.js slide 30

myfirst.js

```
const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');
async function askQuestion() {
  const rl = readline.createInterface({ input, output });
  try {
    const name = await rl.question('What is your name? ');
    const birthyear = await rl.question('What is your birth year in B.E.? ');
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthyear + 543;
    console.log(`Thank you ${name}, aged ${age}!`);
  } finally {
    rl.close(); // Ensures the terminal stream is closed
  }
}
askQuestion();
```

รันด้วย `node myfirst.js`

| ส่วนของโค้ด | ทำอะไร |
| --- | --- |
| `require('node:readline/promises')` | โหลดโมดูล readline แบบ Promise ด้วยคำสั่ง **require** |
| `{ stdin: input, stdout: output }` | ดึง stdin/stdout จาก `node:process` ตั้งชื่อใหม่เป็น input/output |
| `async function` + `await rl.question(...)` | ถามผู้ใช้แล้ว**รอคำตอบ**โดยไม่บล็อกโปรแกรม (ตามแนว async/await ในสไลด์ 27) |
| `new Date().getFullYear()` | ได้ปีปัจจุบันแบบ ค.ศ. ซึ่งเป็นเหตุผลที่ต้อง `+ 543` |
| `currentYear - birthyear + 543` | คำนวณอายุ จากปีเกิดที่ผู้ใช้กรอกเป็น พ.ศ. (B.E.) |
| `finally { rl.close(); }` | ปิด terminal stream เสมอ ไม่ว่าเกิด error หรือไม่ |

ส่วนเสริม · ลองคำนวณ (ตัวอย่างสมมติ) ถ้าปีปัจจุบัน ค.ศ. 2026 และผู้ใช้กรอกปีเกิด 2545 (พ.ศ.): `2026 − 2545 + 543 = 24` ปี

### Creating Node.js Web Application slide 31

การสร้างเว็บแอป "Hello, World!" ต้องมี **3 องค์ประกอบสำคัญ**

1. **Import required modules**: ใช้ `require` โหลดโมดูลของ Node.js
2. **Create server**: สร้าง HTTP Server ที่คอยรับ (listen) clients
3. **Read request and return response**: server อ่าน HTTP request จาก client (เบราว์เซอร์หรือ console) แล้วส่ง response กลับ

### my-first-app.js: Hello World slide 32

my-first-app.js

```
http = require('node:http');
listener = function (request, response) {
  // Send the HTTP header
  // HTTP Status: 200 : OK
  // Content Type: text/html
  response.writeHead(200, {'Content-Type': 'text/html'});
  // Send the response body as "Hello World"
  response.end('<h2 style="text-align: center;">Hello World</h2>');
};
server = http.createServer(listener);
server.listen(3000);
// Console will print the message
console.log('Server running at http://127.0.0.1:3000/');
```

| คำสั่ง | หน้าที่ | เชื่อมกับ Part B |
| --- | --- | --- |
| `require('node:http')` | โหลดโมดูล HTTP (ขั้นตอน 1) | – |
| `http.createServer(listener)` | สร้างเซิร์ฟเวอร์ โดย **listener** คือฟังก์ชันที่ถูกเรียกทุกครั้งที่มี request (ขั้นตอน 2) | – |
| `response.writeHead(200, {...})` | ส่ง **Status Line** (200 OK) และ **Header** (`Content-Type: text/html`) | slide 11 |
| `response.end('...')` | ส่ง **Message Body** แล้วจบ response | slide 11 |
| `server.listen(3000)` | รอรับ request ที่ **port 3000** | slide 7 (host:port) |

### my-second-app.js: อ่านข้อมูลใน Request slide 33

my-second-app.js

```
http = require('node:http');
listener = function (request, response) {
  response.write('rawHeaders: ' + request.rawHeaders + '\n---------\n\n');
  response.write('http version: ' + request.httpVersion + '\n');
  response.write('url: ' + request.url + '\n');
  response.write('method: ' + request.method + '\n');
  response.write('headers.user-agent: ' + request.headers["user-agent"] + '\n');
  response.end('headers.host: ' + request.headers.host + '\n');
};
server = http.createServer(listener);
server.listen(3000);
console.log('Server running at http://127.0.0.1:3000/');
```

| Property ของ request | ให้ค่าอะไร |
| --- | --- |
| `request.rawHeaders` | header ดิบทั้งหมด |
| `request.httpVersion` | เวอร์ชัน HTTP |
| `request.url` | URL path ที่ client ขอ |
| `request.method` | HTTP method (GET, POST ฯลฯ) |
| `request.headers["user-agent"]` | ค่า User-Agent |
| `request.headers.host` | ค่า Host |

ค่าเหล่านี้คือส่วนต่าง ๆ ของ **Request Line** และ **Request Headers** ที่เรียนใน slide 10 โปรแกรมนี้ใช้ `response.write()` หลายครั้งแล้วปิดด้วย `response.end()`

### my-third-app.js: แยกตาม URL (Routing เบื้องต้น) slide 34

my-third-app.js

```
http = require('node:http');
listener = function (request, response) {
  if (request.url === '/user'){
    response.writeHead(200, {'Content-Type': 'application/json'})
    response.end(JSON.stringify({ name : 'John Doe'}))
  } else if (request.url === '/'){
    response.writeHead(200)
    response.end('Hello World')
  } else {
    response.writeHead(404)
    response.end('<Error: Page Not Found')
  }
};
server = http.createServer(listener);
server.listen(3000);
console.log('Server running at http://127.0.0.1:3000/');
```

ผลลัพธ์ของ my-third-app.js ตาม request.urlข้อมูลจากโค้ดในสไลด์

| URL | Status | Content-Type | Body |
| --- | --- | --- | --- |
| `/user` | 200 | `application/json` | `{"name":"John Doe"}` |
| `/` | 200 | (ไม่ได้ตั้ง) | `Hello World` |
| อื่น ๆ ทั้งหมด | 404 | (ไม่ได้ตั้ง) | `<Error: Page Not Found` |

`JSON.stringify()` แปลง object เป็นข้อความ JSON ส่วน **404** คือ "ไม่พบหน้า" และการตั้ง `'Content-Type': 'application/json'` เป็นการบอก client ว่า body เป็น JSON นี่คือจุดเริ่มของ **REST API** ที่ตอบ JSON ในบทถัดไป

สไลด์พิมพ์ผิด / ข้อสังเกต ข้อความ 404 ในสไลด์เขียน `'<Error: Page Not Found'` มีเครื่องหมาย `<` เกินมา ที่น่าจะตั้งใจคือ `'Error: Page Not Found'` ส่วนตัวแปร `http`, `listener`, `server` ในทุกตัวอย่างไม่ได้ประกาศด้วย `const`/`let` (สไลด์เขียนแบบนี้ ที่ตามหลักทั่วไปควรใช้ `const`)

สรุป

## ภาพรวมและประเด็นสอบ

ภาพรวมที่เชื่อมกัน: เว็บทำงานด้วย **HTTP Request/Response** ระหว่าง client กับ server แบบเดิม (**MPA**) server สร้าง HTML ทั้งหน้าให้ แบบสมัยใหม่ (**SPA**) server ส่งเฉพาะ **JSON** ผ่าน **RESTful API** ให้ Front-End หรือ Mobile App นำไปแสดง **Back-End developer** จึงต้องเขียน server ที่รับ request และตอบ response ซึ่ง **Node.js** ทำได้ด้วย JavaScript ภาษาเดียวกับฝั่ง front-end

### ประเด็นที่ต้องจำสำหรับสอบ

- เกณฑ์ประเมิน: Theory 30% + Practice 20% ในการสอบ 2nd และ 3rd (Theory = ปรนัยแบบเลือกคำตอบเดียว + อธิบาย, Practice = เขียนโปรแกรมแก้โจทย์)
- HTTP = **Hyper Text Transfer Protocol** ข้อมูลใน request อยู่ได้ 3 ที่: **Headers, Methods, Bodies**
- **Request** = Request Line + Request Headers + บรรทัดว่าง + Request Message Body
- **Response** = Status Line (บรรทัดแรก) + Http Header + Message Body (Payload)
- **MPA**: โหลดหน้าใหม่ทั้งหน้า (full page refresh) / **SPA**: โหลด HTML ครั้งแรก แล้วใช้ **AJAX/XMLHttpRequest** รับ **JSON**
- **JSON** เป็น text format ที่ language independent เบา อ่านง่ายทั้งคนและเครื่อง
- **Full stack web developer** เขียนได้ทั้ง browser, server และ database
- **SOAP** = Simple Object Access Protocol ใช้ XML และ WSDL / **REST** สร้างโดย Roy Thomas Fielding เป็น design approach ไม่ใช่ protocol
- **Node.js** ไม่ใช่ภาษา เป็น **runtime** ที่รัน JavaScript บนฝั่ง server (open source, free, หลาย OS)
- **Compile**: แปลทั้งโปรแกรมก่อนรัน เร็ว ซ่อน source พกพาน้อย / **Interpret**: แปลทีละบรรทัดตอนรัน ช้ากว่า พกพาดี source เปิดเผย / **Hybrid**: byte code + VM (Interpreter + JIT)
- Node.js เร็วเพราะ **asynchronous** ใน **single thread** ด้วย **async/await** (ตามสไลด์)
- ติดตั้งด้วย `nvm install 22` ตรวจด้วย `node -v`, `npm -v` รันไฟล์ด้วย `node app.js`
- เว็บเซิร์ฟเวอร์ Node.js 3 ขั้น: **require** โมดูล → **createServer** → อ่าน request / ส่ง response (`writeHead`, `end`, `listen`)

### Key Terms

**HTTP Request**ข้อความที่ client ส่งไป server

**HTTP Response**ข้อความที่ server ตอบกลับ

**Request Line**บรรทัดแรกของ request (method, path, version)

**Status Line**บรรทัดแรกของ response เช่น HTTP/1.1 200 OK

**Payload / Message Body**เนื้อหาข้อมูลที่ส่งมา

**MPA**Multi-Page Application โหลดทั้งหน้าใหม่

**SPA**Single Page Application โหลด HTML ครั้งเดียว

**MVC**Model–View–Controller

**Router / url mapping**จับคู่ URL กับโค้ดที่ทำงาน

**AJAX / XMLHttpRequest**ขอข้อมูลจาก server โดยไม่โหลดทั้งหน้า

**JSON**JavaScript Object Notation รูปแบบแลกเปลี่ยนข้อมูล

**Full Stack Developer**เขียนได้ทั้ง client, server, database

**SOAP / WSDL**web service แบบ XML / ภาษาอธิบาย service

**REST**แนวทางออกแบบ web service บนหลักการของ HTTP

**Runtime**สภาพแวดล้อมที่รันโค้ด (Node.js)

**Compiler**แปลทั้งโปรแกรมเป็น machine code ล่วงหน้า

**Interpreter**แปลและรันทีละบรรทัด

**Byte code / JIT**โค้ดกึ่งกลาง / แปลเป็น machine code ตอนรัน

**nvm / npm**ตัวจัดการเวอร์ชัน Node / ตัวจัดการแพ็กเกจ

**async / await**เทคนิคทำงานไม่บล็อกใน single thread

ที่มา: ไฟล์ 2569-01-INT161-Introduction.pdf (วิชา INT161 Basic Backend Development) ครบทั้ง 34 สไลด์ · ตารางเรียน/การประเมินและตัวอย่างโค้ดทั้งหมดมาจากสไลด์ · กล่อง "ส่วนเสริม" (เส้นประเหลือง) คือเนื้อหาที่เพิ่มเอง ได้แก่ ตารางเปรียบเทียบ Request/Response, หน้าที่ MVC, ตารางสรุป compile/interpret/hybrid และตัวอย่างคำนวณอายุ (สมมติ) · กล่องแดงคือจุดที่สไลด์พิมพ์ผิดหรือควรระวัง