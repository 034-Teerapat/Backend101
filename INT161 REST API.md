INT161 · Basic Backend Development · Week-03

# Introduction to RESTful API

ติวจากไฟล์ 03-INT161-Introduction to REST API 1.pdf · ครบ 16 สไลด์

สไลด์ 1–16Part A–Eศัพท์อังกฤษตัวหนา

## ภาพรวมของหัวข้อ

บทนี้อธิบายว่า REST (REpresentational State Transfer) คืออะไร มี **หลักการและข้อบังคับ (constraints)** อะไรบ้าง เจาะลึกที่ **Uniform Interface** (การตั้งชื่อ URI และการเลือก HTTP verb) กับ **Layered System** (การแบ่งชั้น Presentation, Business Logic, Repository) จากนั้นให้แนวทางจัดโครงสร้างโปรเจกต์ Node.js แบบ layered โดยไม่ใช้เฟรมเวิร์ก

เนื้อหานี้ต่อจากบท HTTP Basics โดยตรง เพราะ REST ใช้ HTTP methods (GET, POST, PUT, DELETE) ที่เรียนไปแล้วเป็น "คำกริยา" และใช้ URI เป็น "คำนาม" ของ resource และเป็นพื้นฐานของ Express ที่จะเรียนต่อ

[Part AAgenda และทบทวน Web App / SPA1–4](#A) [Part BREST API คืออะไร5](#B) [Part Cหลักการและข้อบังคับของ REST6–8](#C) [Part DUniform Interface, HTTP Methods และการตั้งชื่อ URI9–13](#D) [Part ELayered System และ Pure Node.js14–16](#E) [สรุปประเด็นสอบและ Key Termsท้ายไฟล์](#S)

Part A

## Agenda และทบทวน Web App / SPA

slide 1–4

### Agenda slide 1–2

สไลด์ 1 คือหน้าปก "**Introduction to RESTful API**" (INT 161, Week-03) สไลด์ 2 ระบุหัวข้อของบท 6 ข้อ

| ข้อ | Agenda (ตามสไลด์) | มีสไลด์รองรับ |
| --- | --- | --- |
| 1 | **REST Principles Overview** | slide 5–8 |
| 2 | **Deep Dive: Uniform Interface** | slide 9–13 |
| 3 | **Deep Dive: Layered System** | slide 14 |
| 4 | **Implementing REST without Frameworks (Built-in http Module)** | slide 15 (เฉพาะโครงสร้างโฟลเดอร์) และ 16 Practice |
| 5 | **Building a Layered Architecture in Pure Node.js** | slide 15 |
| 6 | **Key Takeaways** | ไม่มีสไลด์ในไฟล์นี้ (ดูสรุปท้ายหน้า) |

ข้อ 4 และ 6 ในไฟล์นี้ไม่มีสไลด์เนื้อหาเต็ม ส่วนข้อ 4 คือภาคปฏิบัติ (Practice) ที่ผู้สอนให้ทำในห้อง

### ทบทวน: Web Application และ SPA slide 3–4

สไลด์ 3 และ 4 นำแผนภาพจากบทก่อนมาทบทวนเพื่อเข้าสู่ REST

slide 3 · Web ApplicationClient ส่ง **Http Request** ไปที่ **Node.js / Bun** และได้ **Http Response** กลับ โดย server ต่อกับ **Database Server**

→

slide 4 · SPAWeb Browser ขอ HTML ครั้งแรก (**initial request**) จาก Front-End แล้ว Web Browser และ Mobile App ใช้ **AJAX** คุยกับ **Back-End: RESTful API / Microservice** ด้วย **{JSON}** ซึ่ง Back-End ต่อกับ **DB**

จุดเชื่อม: Back-End ในแผนภาพ SPA คือ "RESTful API" ที่บทนี้จะอธิบายว่ามีหลักการอย่างไร (รายละเอียดแผนภาพทั้งสองดูไฟล์ 01 Part C และไฟล์ 02 Part B)

Part B

## REST API คืออะไร

slide 5

REST stands for REpresentational State Transfer and was created by computer scientist Roy Fielding.

REST ย่อมาจาก REpresentational State Transfer สร้างโดยนักวิทยาการคอมพิวเตอร์ Roy Fielding (สไลด์เน้นตัวอักษร RE, S, T ในชื่อ)

- **REST API** (หรือ **RESTful API**) คือ API (หรือ web API) ที่สอดคล้องกับ **constraints** ของ **REST architectural style** และใช้ติดต่อกับ **RESTful web services**
- ใน REST architecture **REST Server** แค่ให้เข้าถึง **resources** ส่วน **REST client** เป็นฝ่ายเข้าถึงและแก้ไข resources
- แต่ละ resource ถูกระบุด้วย **URIs / global IDs**
- REST ใช้ **representation** หลายรูปแบบแทน resource เช่น text, **JSON**, **XML** โดย **JSON เป็นที่นิยมที่สุด**

| คำ | ความหมายตามสไลด์ |
| --- | --- |
| **Resource** | สิ่งที่ server ให้เข้าถึง ระบุตัวด้วย URI / global ID |
| **Representation** | รูปแบบข้อมูลที่ใช้แทน resource (text, JSON, XML) |
| **REST Server** | ให้เข้าถึง resources |
| **REST Client** | เข้าถึงและแก้ไข resources |

อ้างอิง: restfulapi.net และ w3schools.com/nodejs/nodejs_rest_api.asp (เชื่อมกับ Part E ใน slide 20 ของไฟล์ 01 ที่บอกว่า "REST เป็นแนวทางออกแบบ ไม่ใช่โปรโตคอล")

Part C

## หลักการและข้อบังคับของ REST

slide 6–8

สไลด์ 6–8 ใช้ชื่อ **RESTful Principles and Constraints** แบ่งเป็น 6 ข้อ แสดงทีละข้อดังนี้

### 1) RESTful Client-Server slide 6

- Server มี **RESTful web service** ให้บริการฟังก์ชันที่ client ต้องการ
- Client ส่ง request ไปที่ web service บน server แล้ว server จะ **ปฏิเสธ** หรือ **ตอบรับ** พร้อมส่ง response ที่เหมาะสมกลับ

### 2) Stateless slide 6

Statelessness mandates that each request from the client to the server must contain all of the information necessary to understand and complete the request.

Stateless บังคับว่าทุก request จาก client ถึง server ต้องมีข้อมูลครบถ้วนที่จำเป็นต่อการเข้าใจและทำ request นั้นให้สำเร็จ

- Server **ห้ามใช้ประโยชน์จากข้อมูล context ที่เคยเก็บไว้บน server**
- ดังนั้น client ต้องเก็บ **session state** เองทั้งหมด

### 3) Interface / Uniform Contract slide 7

เป็นเทคนิคพื้นฐานว่า RESTful web services ควรทำงานอย่างไร โดยทำงานบน **HTTP web layer** และใช้ "verbs" หลักต่อไปนี้กับ resources บน server

| Verb | หน้าที่ (ตามสไลด์) |
| --- | --- |
| POST | To create a resource on the server (สร้าง resource) |
| GET | To retrieve a resource from the server (ดึง resource) |
| PUT | To change the state of a resource or to update it (แก้ไข) |
| DELETE | To remove or delete a resource from the server (ลบ) |

### 4) Layered system slide 7

- ให้สถาปัตยกรรมประกอบด้วย **hierarchical layers** (ชั้นเรียงลำดับ) โดยจำกัดพฤติกรรมของ component
- ตัวอย่าง: ใน layered system แต่ละ component **มองไม่เห็นเกินชั้นที่ตัวเองคุยด้วยโดยตรง** (immediate layer)

### 5) Cacheable slide 8

- Response ต้อง **ระบุตัวเอง** (implicitly หรือ explicitly) ว่า **cacheable** หรือ **non-cacheable**
- ถ้า cacheable ฝั่ง client มีสิทธิ์ **นำข้อมูล response ไปใช้ซ้ำ** กับ request ที่เทียบเท่ากันได้ภายในช่วงเวลาที่กำหนด

### 6) Code on demand (optional) slide 8

- REST อนุญาตให้ขยายความสามารถของ client โดยดาวน์โหลดและรันโค้ดในรูป **applets** หรือ **scripts**
- Server ส่งฟีเจอร์บางส่วนให้ client ในรูปโค้ด แล้ว client แค่รันโค้ดนั้น
- ข้อนี้เป็น **optional** (ข้อเดียวที่ไม่บังคับ)

### ตารางสรุป 6 ข้อ

| ข้อ | Constraint | ใจความสำคัญ | บังคับ? |
| --- | --- | --- | --- |
| 1 | **Client-Server** | server ให้บริการ client ส่ง request แล้ว server ปฏิเสธหรือตอบรับ | ใช่ |
| 2 | **Stateless** | ทุก request มีข้อมูลครบ server ไม่เก็บ context client เก็บ session state | ใช่ |
| 3 | **Uniform Contract** | ใช้ HTTP verbs POST, GET, PUT, DELETE กับ resources | ใช่ |
| 4 | **Layered system** | แบ่งชั้น แต่ละชั้นเห็นแค่ชั้นที่ติดกัน | ใช่ |
| 5 | **Cacheable** | response ระบุว่า cache ได้หรือไม่ ถ้าได้ client ใช้ซ้ำได้ | ใช่ |
| 6 | **Code on demand** | client โหลดโค้ด (applets/scripts) มารันเพิ่มได้ | optional |

สไลด์พิมพ์ผิด สไลด์ 6 เขียน "The client **send's** a request" ที่ถูกคือ **sends**

ตารางสรุปนี้เรียบเรียงจากสไลด์ 6–8 ไม่ใช่ตารางในสไลด์ คอลัมน์ "บังคับ?" ใช้คำว่า optional ตามที่สไลด์ระบุเฉพาะข้อ Code on demand

Part D

## Uniform Interface, HTTP Methods และการตั้งชื่อ URI

slide 9–13

### Uniform Interface slide 9

The fundamental constraint that decouples clients from server implementations

เป็น constraint พื้นฐานที่ทำให้ client แยกอิสระ (decouple) จากการทำงานภายในของ server

**4 Core Pillars** (เสาหลัก 4 ข้อ)

| ข้อ | Pillar | ความหมายตามสไลด์ |
| --- | --- | --- |
| 1 | **Resource Identification** | URIs กำหนด resources **ไม่ใช่ actions** (เช่น `/api/v1/users`) |
| 2 | **Manipulation via Representations** | แลกเปลี่ยน state ด้วย format มาตรฐาน (**JSON**) |
| 3 | **Self-Descriptive Messages** | ใช้ HTTP methods มาตรฐาน (GET, POST, PUT, DELETE) และ headers (`Content-Type: application/json`) |
| 4 | **HATEOAS** | **Hypermedia links** ชี้นำการกระทำของ client แบบ dynamic |

อ้างอิง: restfulapi.net/resource-naming/

ส่วนเสริม · HATEOAS HATEOAS ย่อมาจาก **Hypermedia As The Engine Of Application State** สไลด์ไม่ได้ขยายตัวย่อ แนวคิดคือ response นอกจากข้อมูลยังแนบลิงก์ว่า client ทำอะไรต่อได้ เช่น

```
{ "id": 1, "name": "Pen",
  "links": [ { "rel": "orders", "href": "/api/products/1/orders" } ] }
```

(ตัวอย่างสมมติ ไม่ได้อยู่ในสไลด์)

### HTTP Methods slide 10

| Method | Purpose | Example |
| --- | --- | --- |
| GET | Retrieve data | `/api/v1/users` |
| POST | Create new resource | `/api/v1/users` (with data) |
| PUT | Update existing data | `/api/v1/users/{id}` (with data) |
| DELETE | Remove a resource | `/api/v1/users/{id}` |

เหมือนตารางของไฟล์ 02 (slide 11) แต่เปลี่ยน resource เป็น `/api/v1/users` ที่มี **/api** นำหน้าและมี **version** (`v1`) สไลด์เว้นวรรคใน `/ api/v1/users/{id}` ซึ่งเป็นการพิมพ์ผิด ที่ถูกไม่มีช่องว่าง

### Rules of REST API endpoints slide 11

กฎที่ต้องคำนึงถึงเมื่อสร้าง endpoint ของ REST API

1. REST ยึด **resource หรือ noun (คำนาม)** ไม่ใช่ action หรือ verb (คำกริยา) หมายความว่า URI ของ REST API ควร**ลงท้ายด้วยคำนามเสมอ** ตัวอย่างที่ดีคือ `/api/users`
2. **HTTP verbs** ใช้ระบุ action ได้แก่ GET, PUT, POST, DELETE และ **PATCH**
3. จัดเว็บแอปเป็น resources เช่น users แล้วใช้ HTTP verbs แก้ไข resources นั้น เมื่อดูที่ **endpoint + HTTP method** นักพัฒนาควรเข้าใจได้ทันทีว่าต้องทำอะไร

#### ควร

- `GET /api/users` (noun + verb บอก action)

#### ไม่ควร

- ใส่คำกริยาใน URI เช่น `/api/getUsers`

กล่อง "ควร / ไม่ควร" เป็นการยกตัวอย่างเพิ่มเอง (`/api/getUsers` ไม่ได้อยู่ในสไลด์) ตามหลักของกฎข้อ 1 ที่ว่า URI ไม่ใช่ verb

### RESTful Resource Uniform Interface slide 12

ตัวอย่าง resource "products"ข้อมูลจากสไลด์

| URI | HTTP Verb | Description |
| --- | --- | --- |
| `api/products` | GET | Get all products |
| `api/products/1` | GET | Get an products with id = 1 |
| `api/products/1/orders` | GET | Get all orders for product id = 1 |
| `api/products` | POST | Add new products |
| `api/products/1` | PUT | Update an products with id = 1 |
| `api/products/1` | DELETE | Delete an products with id = 1 |

Always use plurals in URL to keep an API URI consistent throughout the application.

ใช้ชื่อแบบพหูพจน์ (plural) ใน URL เสมอ เพื่อให้ URI ของ API สม่ำเสมอทั้งแอป

Send a proper HTTP code to indicate a success or error status.

ส่ง HTTP status code ที่เหมาะสมเพื่อบอกว่าสำเร็จหรือเกิดข้อผิดพลาด

ลักษณะที่ต้องจำ: URI เดียวกัน (`api/products/1`) ทำได้ 3 อย่างแล้วแต่ verb (GET ดู, PUT แก้, DELETE ลบ) ส่วน `api/products` ใช้ GET ดูทั้งหมดและ POST เพิ่มใหม่ และ `api/products/1/orders` คือ sub-collection ของ product 1

สไลด์พิมพ์ผิด สไลด์เขียน "Get **an products**", "Update **an products**", "Delete **an products**" ที่ถูกควรเป็น "a product"

ส่วนเสริม · ตัวอย่าง status code ที่พบบ่อย สไลด์แค่บอกให้ส่ง HTTP code ที่เหมาะสม ไม่ได้ยกตัวเลข ตัวที่ใช้บ่อย: 200 OK, 201 Created (หลัง POST สำเร็จ), 404 Not Found (ไม่มี resource นั้น ตัวเดียวกับที่เจอในไฟล์ 01 slide 34)

### REST API URI Naming Conventions and Best Practices slide 13

แผนภาพในสไลด์แยกส่วนของ URL `http://localhost:9999/restfulservices/v1/users/{id}` ออกเป็น 7 ส่วน โดยวงเล็บใหญ่ครอบ **Restful Endpoint**

| ส่วนของ URL | ค่าในตัวอย่าง | ป้ายในสไลด์ | อยู่ใน Restful Endpoint? |
| --- | --- | --- | --- |
| `http://` | http | **Protocol** | ไม่ |
| `localhost` | localhost | **Host (domain name)** | ไม่ |
| `:9999` | 9999 | **Port** | ไม่ |
| `/restfulservices` | restfulservices | **Application Context** | ใช่ |
| `/v1` | v1 | **Version** | ใช่ |
| `/users` | users | **Resource** | ใช่ |
| `/{id}` | {id} | **Parameter** | ใช่ |

ตามภาพ วงเล็บ Restful Endpoint ครอบตั้งแต่ Application Context จนถึง Parameter

#### Singleton / Collection / Sub-collection Resources

| URI | ชนิด (ตามสไลด์) |
| --- | --- |
| `/customers` | **collection resource** (ชุดของ resource ทั้งหมด) |
| `/customers/{id}` | **singleton resource** (resource หนึ่งตัวที่ระบุด้วย id) |
| `/customers/{id}/orders` | **sub-collection resource** (ชุดย่อยของ resource ตัวนั้น) |

อ้างอิง: restfulapi.net/resource-naming

Part E

## Layered System และ Pure Node.js

slide 14–16

### Layered System slide 14

Concept: Hierarchy of intermediate layers where each layer only interacts with its adjacent neighbor

แนวคิด: ลำดับชั้นของ layer ตัวกลาง โดยแต่ละ layer คุยได้เฉพาะ layer ที่อยู่ติดกัน

แผนภาพในสไลด์: **Front-End** ส่งและรับ **{JSON}** กับ layer บนสุด แล้ว layer ต่าง ๆ ส่ง **Entity Object** คั่นระหว่างกัน (เส้นประแบ่งชั้น)

| ชั้น | ชื่อ layer ในภาพ | บทบาทที่ป้ายกำกับ | สิ่งที่ส่งต่อ |
| --- | --- | --- | --- |
| 1 (บน) | **HTTP / Routing Layer** | **Presentation** | รับ/ส่ง {JSON} กับ Front-End |
| 2 | **Service Layer** | **Business Logic** | ส่ง **Entity Object** ขึ้น-ลงกับชั้น 1 และ 3 |
| 3 (ล่าง) | **Data Access Layer** | **Repository** | คุยกับฐานข้อมูล (ไอคอนฐานข้อมูลด้านล่าง) |

Front-Endส่ง/รับ {JSON}

↔

HTTP / Routing LayerPresentation

↔ Entity Object ↔

Service LayerBusiness Logic

↔ Entity Object ↔

Data Access LayerRepository → Database

**Benefits** ตามสไลด์

| ประโยชน์ | ความหมาย |
| --- | --- |
| **Scalability** | เพิ่ม shared caches และ **load balancers** ได้โดย client ไม่ต้องแก้ |
| **Separation of Concerns** | แยกการ parse HTTP ดิบออกจาก business logic และการทำงานกับฐานข้อมูลโดยสิ้นเชิง |
| **Security** | สไลด์เขียนหัวข้อไว้ ไม่มีคำอธิบายเพิ่ม |

ส่วนเสริม · ตัวอย่างการไหลของ request (สมมติ) ตัวอย่าง `GET api/products/1` ตามแนว 3 ชั้น (ไม่ได้อยู่ในสไลด์)

| ลำดับ | Layer | ทำอะไร |
| --- | --- | --- |
| 1 | HTTP / Routing | จับคู่ URL + method อ่าน id = 1 แล้วเรียก Service |
| 2 | Service | ใช้กฎทางธุรกิจ แล้วเรียก Repository |
| 3 | Repository | ดึงข้อมูลจากไฟล์หรือฐานข้อมูล คืนเป็น Entity Object |
| 4 | กลับขึ้นมา | Entity → Service → Routing แปลงเป็น {JSON} ส่ง response พร้อม status code |

### Designing Software Layers in Pure Node.js slide 15

**Separate concerns cleanly without external frameworks** (แยกหน้าที่ให้ชัดเจนโดยไม่ใช้เฟรมเวิร์กภายนอก) โครงสร้างโฟลเดอร์ในสไลด์

```
src/
├── server.js       --> Native HTTP Server Setup
├── router.js       --> Route Matching & HTTP Handling
├── services/       --> Business Logic (Framework-Agnostic)
└── repositories/   --> Data Access Layer (File System / DB)
```

| ไฟล์ / โฟลเดอร์ | หน้าที่ (ตามสไลด์) | ตรงกับ layer ใน slide 14 |
| --- | --- | --- |
| `server.js` | **Native HTTP Server Setup** ตั้งค่า HTTP server (เช่น `http.createServer`) | จุดเริ่มต้น / Presentation |
| `router.js` | **Route Matching & HTTP Handling** จับคู่เส้นทาง และจัดการ HTTP | HTTP / Routing Layer |
| `services/` | **Business Logic (Framework-Agnostic)** ไม่ผูกกับเฟรมเวิร์ก | Service Layer |
| `repositories/` | **Data Access Layer (File System / DB)** | Data Access Layer |

คอลัมน์ขวาเป็นการจับคู่ให้เห็นความสัมพันธ์กับแผนภาพ slide 14 (ไม่ได้เขียนในสไลด์ตรง ๆ แต่ชื่อ Routing, Service, Data Access ตรงกัน) **Framework-Agnostic** แปลว่าโค้ดชั้นนี้ไม่ผูกกับเฟรมเวิร์กใด เอาไปใช้กับ Express ในบทถัดไปได้

### Practice slide 16

สไลด์ 16 เป็นหน้าคั่น "**Practice**" มีรูปไอคอนโปรแกรมเมอร์ ไม่มีโจทย์ระบุในไฟล์ (ผู้สอนให้โจทย์ในห้อง) ภาคปฏิบัติตรงกับ Agenda ข้อ 4–5 คือเขียน REST API ด้วยโมดูล `http` เปล่า ๆ ตามโครงสร้างใน slide 15

สรุป

## ภาพรวมและประเด็นสอบ

ภาพรวมที่เชื่อมกัน: **REST** คือแนวทางออกแบบ web API ที่ถือว่าทุกอย่างเป็น **resource** ที่ระบุด้วย **URI** (คำนาม พหูพจน์) และใช้ **HTTP verb** (GET, POST, PUT, DELETE) บอก action ส่งข้อมูลเป็น **JSON** โดยทุก request **stateless** ฝั่ง server จัดโครงสร้างเป็น **layers** (Routing → Service → Repository) เพื่อแยกหน้าที่ ขยายระบบง่าย และปลอดภัย

### ประเด็นที่ต้องจำสำหรับสอบ

- REST = **REpresentational State Transfer** สร้างโดย **Roy Fielding** resource ระบุด้วย URI / global ID และ JSON เป็น representation ที่นิยมที่สุด
- **6 constraints:** Client-Server, Stateless, Uniform Contract (Interface), Layered system, Cacheable, Code on demand (**optional** ข้อเดียว)
- **Stateless:** ทุก request มีข้อมูลครบ server ไม่ใช้ context ที่เก็บไว้ client เก็บ session state เอง
- **Uniform Interface 4 pillars:** Resource Identification, Manipulation via Representations, Self-Descriptive Messages, HATEOAS
- URI ใช้ **noun** ไม่ใช่ verb (`/api/users`) ใช้ **plural** สม่ำเสมอ และส่ง HTTP code ที่เหมาะสม
- Mapping: **GET** ดึงข้อมูล, **POST** สร้าง, **PUT** แก้ไข (ต้องมี `/{id}`), **DELETE** ลบ (ต้องมี `/{id}`)
- ชนิด resource: **collection** (`/customers`), **singleton** (`/customers/{id}`), **sub-collection** (`/customers/{id}/orders`)
- ส่วนของ URL: Protocol, Host, Port, Application Context, Version, Resource, Parameter
- **Layered system:** Presentation (HTTP/Routing) → Business Logic (Service) → Repository (Data Access) แต่ละชั้นคุยกับชั้นติดกัน ส่ง Entity Object คั่น ประโยชน์คือ Scalability, Separation of Concerns, Security
- โครงสร้าง Pure Node.js: `server.js`, `router.js`, `services/`, `repositories/`

### Key Terms

**REST**REpresentational State Transfer

**RESTful API**API ที่สอดคล้องกับ constraints ของ REST

**Resource**สิ่งที่ให้เข้าถึง ระบุด้วย URI

**Representation**รูปแบบข้อมูลแทน resource (JSON, XML, text)

**URI**ตัวระบุ resource

**Stateless**แต่ละ request ครบในตัว server ไม่เก็บ context

**Cacheable**response ระบุว่า client ใช้ซ้ำได้หรือไม่

**Code on demand**ส่งโค้ดให้ client รัน (optional)

**Uniform Interface**constraint ที่แยก client จาก server implementation

**HATEOAS**ใช้ hypermedia links ชี้นำ client

**Self-Descriptive Messages**ใช้ HTTP method และ header มาตรฐาน

**Collection / Singleton**ชุด resource / resource เดียว

**Sub-collection**ชุดย่อยใน resource เช่น /customers/{id}/orders

**Application Context**ส่วนบอกชื่อแอปใน URL

**Layered System**แบ่งชั้นที่แต่ละชั้นเห็นแค่ชั้นติดกัน

**Entity Object**object ข้อมูลที่ส่งระหว่าง layer

**Service Layer**ชั้น Business Logic

**Repository**ชั้น Data Access

**Separation of Concerns**แยกหน้าที่ของโค้ดให้ชัด

**Framework-Agnostic**ไม่ผูกกับเฟรมเวิร์กใด

ที่มา: ไฟล์ 03-INT161-Introduction to REST API 1.pdf (INT161 Basic Backend Development, Week-03) ครบทั้ง 16 สไลด์ · ตารางและตัวอย่างหลักมาจากสไลด์ · กล่อง "ส่วนเสริม" (เส้นประเหลือง) คือเนื้อหาที่เพิ่มเอง ได้แก่ HATEOAS ขยายตัวย่อพร้อมตัวอย่างสมมติ, ตัวอย่าง status code, ตัวอย่างการไหลของ request และกล่อง "ควร/ไม่ควร" ในกฎ endpoint · ตารางสรุป 6 ข้อใน Part C เรียบเรียงจากสไลด์ · กล่องแดงคือจุดที่สไลด์พิมพ์ผิด