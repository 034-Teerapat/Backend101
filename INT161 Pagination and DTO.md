INT161 · Basic Backend Development · Week-07

# Pagination และ DTO

ติวจากไฟล์ 07-INT161-Pagination and DTO.pdf · ครบ 23 สไลด์

สไลด์ 1–23Part A–Gศัพท์อังกฤษตัวหนา

## ภาพรวมของหัวข้อ

บทนี้ทำ REST API ให้ตอบข้อมูลก้อนใหญ่ได้อย่างเหมาะสม 2 เรื่อง เรื่องแรกคือ **Pagination** (แบ่งหน้า) ด้วย `page`, `limit`, `offset` และ MySQL `LIMIT ... OFFSET ...` พร้อม `COUNT(*)` เพื่อทำ metadata เรื่องที่สองคือ **DTO (Data Transfer Object)** ที่ใช้คั่นกลางระหว่าง **Entity** ในฐานข้อมูลกับข้อมูลที่ API ส่งออก เพื่อไม่ให้ field สำคัญหลุดและให้ response เป็นรูปแบบเดียวกัน ครึ่งหลังของไฟล์เป็นโค้ดตัวอย่างโปรเจกต์ Product ตั้งแต่ Middleware, Repository, Mapper, Service, Api Response ไปจนถึง Router

[Part Aวัตถุประสงค์และเหตุผลที่ต้องแบ่งหน้า1–3](#A) [Part Bพารามิเตอร์ สูตร offset และ flow4–5](#B) [Part CMySQL Query, JSON Response, Best Practices6–8](#C) [Part DDTO, Entity vs DTO และสรุป9–12](#D) [Part EPractices: Pagination Middleware13–15](#E) [Part FRepository, Mapper, Service16–20](#F) [Part GApi Response และ Router21–23](#G) [สรุปประเด็นสอบและ Key Termsท้ายไฟล์](#S)

Part A

## วัตถุประสงค์และเหตุผลที่ต้องแบ่งหน้า

slide 1–3

### หน้าปกและ Unit Objectives slide 1–2

สไลด์ 1 คือหน้าปก "REST API Response **Pagination** and **Data Transfer Object**" สไลด์ 2 ระบุวัตถุประสงค์ 10 ข้อ

| ข้อ | วัตถุประสงค์ (ตามสไลด์) | อยู่ในส่วน |
| --- | --- | --- |
| 1 | Explain why REST APIs use **pagination** for large collections of data | Part A (3) |
| 2 | Describe the relationship between **page, limit, and offset** | Part B (4) |
| 3 | Write MySQL queries with **LIMIT, OFFSET, ORDER BY, and COUNT(\*)** | Part C (6) |
| 4 | Build a paginated REST API endpoint using Node.js and Express.js | Part E–G (14–23) |
| 5 | Validate pagination query parameters and define **safe limits** | Part C, E (8, 14) |
| 6 | Design a consistent **JSON response** with pagination metadata | Part C, G (7, 21–22) |
| 7 | Explain the purpose of a **DTO** | Part D (9–10) |
| 8 | Distinguish between a database **entity**, a **request DTO**, and a **response DTO** | Part D (11), F (18–19) |
| 9 | Design DTOs that avoid exposing sensitive or unnecessary database fields | Part D, F (11, 18) |
| 10 | Apply pagination and DTO together to create a clear, maintainable **API contract** | Part F–G |

สไลด์ไม่ครอบคลุมทุกข้อ วัตถุประสงค์ข้อ 3 พูดถึง `ORDER BY` แต่ไม่มีสไลด์ใดเขียน SQL ที่ใช้ `ORDER BY` และข้อ 8 พูดถึง **request DTO** แต่โค้ดตัวอย่างมีเฉพาะ response DTO (Mapper แปลง entity เป็นข้อมูลขาออก)

ส่วนเสริม · ทำไมควรมี ORDER BY (ตัวอย่างสมมติ) ถ้าแบ่งหน้าโดยไม่ระบุลำดับ MySQL ไม่รับประกันว่าแต่ละครั้งจะเรียงแถวเหมือนเดิม หน้าที่ 2 อาจซ้ำหรือตกหล่นข้อมูล จึงควรเรียงด้วยคอลัมน์ที่คงที่ เช่น

```
SELECT * FROM products ORDER BY productCode LIMIT ? OFFSET ?
```

### Why Pagination Matters slide 3

- ส่งทุก record กลับมาทำให้ response ใหญ่ (**large responses**)
- response ใหญ่เพิ่มงานของฐานข้อมูล, การใช้หน่วยความจำ และการส่งผ่านเครือข่าย
- Pagination ทำให้ client คาดเดาขนาด response ได้ (**predictable response sizes**)

Part B

## พารามิเตอร์ สูตร offset และ flow

slide 4–5

### Pagination Parameters slide 4

ตัวอย่างคำขอในสไลด์: `GET /api/products?page=2&limit=20`

| พารามิเตอร์ | ความหมาย | ที่มา |
| --- | --- | --- |
| `page` | หมายเลขหน้าที่ขอ | client ส่งมา |
| `limit` | จำนวน record ต่อหน้า | client ส่งมา |
| `offset` | จำนวน record ที่ต้อง**ข้าม** | **คำนวณ** ฝั่งเซิร์ฟเวอร์ |

OFFSET = (page - 1) x limit

offset = (หน้าที่ขอ − 1) × จำนวนต่อหน้า

```
const page = query.page || 1
const limit = query.limit || 20
const offset = (page - 1) * limit
```

ตารางตัวอย่างในสไลด์ (limit = 10)

| page | limit | offset | take (record ที่ได้) |
| --- | --- | --- | --- |
| 1 | 10 | 0 | 1-10 |
| 2 | 10 | 10 | 11-20 |
| 3 | 10 | 20 | 21-30 |
| 9 | 10 | 80 | 81-90 |

ส่วนเสริม · ตัวอย่างจากคำขอของสไลด์ (page=2, limit=20) offset = (2 − 1) × 20 = **20** ข้าม 20 แถวแรก ได้แถวที่ 21–40 ซึ่ง SQL ที่ใช้คือ `... LIMIT 20 OFFSET 20` ค่าเริ่มต้น `page || 1` และ `limit || 20` ใช้เมื่อ client ไม่ส่งค่ามา

### Pagination Flow slide 5

1 · Client requestส่ง page และ limit

→

2 · Express routeตรวจ page/limit (หรือใช้ middleware)

→

3 · APIคำนวณ offset

→

4 · MySQLดึง record ด้วย LIMIT และ OFFSET

→

5 · API คืนค่าitems + pagination metadata

Part C

## MySQL Query, JSON Response, Best Practices

slide 6–8

### MySQL Query slide 6

```
const TABLE_NAME = "products"
const ENTITY_NAME = "Product"

const COUNT_ALL = `SELECT COUNT (*) as total FROM ${TABLE_NAME}`
const FIND_ALL_SQL = `SELECT * FROM ${TABLE_NAME}`

async function count() {
  const [[{ total }]] = await db.query(COUNT_ALL);
  return total;
}
export async function findAll(pagination) {
  if (!pagination) {
     const [rows] = await db.query (FIND_ALL_SQL)
     return rows
  }
  const SQL = FIND_ALL_SQL + ' LIMIT ? OFFSET ?'
  const {limit, offset} = pagination
  const [rows] = await db.query(SQL, [limit, offset])
  rows.totalItems = await count()
  return rows
}
```

กล่องเหลืองในสไลด์: "**totalItems** helps to calculate the total number of pages and pagination info."

| ส่วนของโค้ด | ความหมาย |
| --- | --- |
| `COUNT_ALL` / `count()` | นับจำนวนแถวทั้งหมดของตาราง ได้ `total` (ใช้ `const [[{ total }]]` แกะผลลัพธ์ 2 ชั้นของ mysql2 ออกมาเป็นตัวเลข) |
| `findAll(pagination)` | ถ้า**ไม่มี** pagination → ดึงทุกแถว ถ้ามี → ต่อ `' LIMIT ? OFFSET ?'` แล้วส่ง `[limit, offset]` เป็นพารามิเตอร์ |
| `rows.totalItems = await count()` | แปะจำนวนทั้งหมดไว้เป็น property ของ array ผลลัพธ์ เพื่อใช้คำนวณ `totalPages` ภายหลัง |

สไลด์พิมพ์ผิด `"products”`, `"Product”` และ `' LIMIT ? OFFSET ?’` ใช้เครื่องหมายคำพูดโค้งปิด ถ้าคัดลอกต้องแก้เป็นเครื่องหมายตรง นอกจากนี้ `COUNT (*)` มีช่องว่างก่อนวงเล็บ และ `db.query (FIND_ALL_SQL)` เช่นกัน (รันได้ แต่ไม่เป็นแบบแผน)

ส่วนเสริม · ข้อสังเกตเรื่อง prepared statement สไลด์ 8 บอกให้ใช้ SQL prepared statements ซึ่งโค้ดนี้ใช้ `?` เป็นตัวแทนค่า ตัวอย่างเรียกผ่าน `db.query` (mysql2 จะแทนค่าและ escape ให้ที่ฝั่งไคลเอนต์) ส่วน `db.execute` ใช้ prepared statement ฝั่งเซิร์ฟเวอร์จริง ดูไฟล์ 04 ประกอบ

### JSON Response Structure slide 7

```
{
    "success": true,
    "data": [],
    "pagination": {
      "page": 2,
      "limit": 20,
      "totalItems": 138,
      "totalPages": 7,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
}
```

| ฟิลด์ | ความหมาย | ตรวจจากตัวเลขในสไลด์ |
| --- | --- | --- |
| `success` | สถานะสำเร็จ | — |
| `data` | รายการข้อมูลของหน้านี้ (ในสไลด์เป็น array ว่าง) | — |
| `page`, `limit` | หน้าที่ขอ และจำนวนต่อหน้า | 2 และ 20 |
| `totalItems` | จำนวน record ทั้งหมด | 138 |
| `totalPages` | จำนวนหน้าทั้งหมด | ⌈138 ÷ 20⌉ = 7 ✔ |
| `hasNextPage` | มีหน้าถัดไปไหม | 2 × 20 = 40 \< 138 → true ✔ |
| `hasPreviousPage` | มีหน้าก่อนหน้าไหม | page = 2 > 1 → ควรเป็น true |

สไลด์ไม่สอดคล้องกันเอง ตัวอย่างระบุ `page: 2` แต่ `"hasPreviousPage": false` ซึ่งผิด เพราะหน้า 2 มีหน้าก่อนหน้า (ตามโค้ดสไลด์ 22: `hasPrevPage: page > 1` จะเป็น true) และชื่อฟิลด์ในโค้ดจริง (สไลด์ 22) ต่างจากตัวอย่างนี้ด้วย: โค้ดใช้ `total` และ `hasPrevPage` ส่วนตัวอย่างใช้ `totalItems` และ `hasPreviousPage` (ดู Part G)

### Pagination Best Practices slide 8

| ข้อ | แนวปฏิบัติ (ตามสไลด์) |
| --- | --- |
| 1 | Validate that **page is at least 1** |
| 2 | Set a **maximum limit**, such as 100 |
| 3 | Use SQL **prepared statements** |
| 4 | Create table **indexes** for filtering and sorting columns |
| 5 | Consider **cursor pagination** mechanism when users access very deep pages |

โค้ดประกอบทางขวาของสไลด์

```
const query = req.query || {};
const pageSize = query.limit || 20
Math.max(parseInt(page), 1)
Math.min(parseInt(pageSize), 100)
const offset = (page - 1) * pageSize
```

สไลด์เขียนไม่ครบ สองบรรทัด `Math.max(...)` / `Math.min(...)` ไม่ได้เอาผลไปเก็บในตัวแปร และ `page` ไม่ได้ประกาศ เป็นเพียงภาพสั้น ๆ ของแนวคิด เวอร์ชันที่ใช้งานจริงอยู่ในสไลด์ 14

ส่วนเสริม · ทำไม deep page ถึงช้า `OFFSET` ที่ใหญ่ทำให้ MySQL ต้องอ่านแล้ว**ทิ้ง**แถวข้างหน้าทั้งหมดก่อน จึงช้าลงเมื่อหน้าลึก **cursor pagination** แก้ด้วยการส่ง "ค่าของแถวสุดท้ายที่เห็น" (เช่น id) แล้วถามต่อด้วยเงื่อนไข เช่น `WHERE id > ? ORDER BY id LIMIT ?` สไลด์แค่เอ่ยถึง ไม่ได้สอนวิธีทำ

Part D

## DTO, Entity vs DTO และสรุป

slide 9–12

### DTO: Data Transfer Object slide 9

A DTO is an object that defines data exchanged between API layers.

DTO คือ object ที่กำหนดข้อมูลซึ่งแลกเปลี่ยนกันระหว่างชั้นต่าง ๆ ของ API

- ควบคุม**รูปร่าง** (shape) ของข้อมูล request และ response
- แยก **API contract** ภายนอก ออกจาก **database models**

**Why Use DTOs**

| ประโยชน์ (ตามสไลด์) | ความหมาย |
| --- | --- |
| Prevents accidental exposure of sensitive fields | กันไม่ให้ field ลับหลุดโดยไม่ตั้งใจ |
| Makes API responses consistent | response เป็นรูปแบบเดียวกัน |
| Simplifies validation and documentation | ตรวจสอบและเขียนเอกสารง่ายขึ้น |
| Reduces coupling between the database and API clients | ลดการผูกกันระหว่างฐานข้อมูลกับผู้ใช้ API (เปลี่ยนตารางโดยไม่กระทบ client) |

### DTO: Data Transfer Object (แผนภาพ) slide 10

| ส่วนในแผนภาพ | รายละเอียด |
| --- | --- |
| ซ้าย | **Front-end** ↔ JSON ↔ **Controller** → **Service** → **Repository** → ฐานข้อมูล โดยระหว่าง Service/Repository และ Repository/DB ติดป้าย **Entity** |
| กลาง | ดาว **DTO** เชื่อมกับฝั่ง Controller (ชั้นที่ส่งข้อมูลออกไป Front-end) |
| ขวา | **Customer Entity** → **mapper** → **Customer Type 1, Type 2, … Type n** (หลายเวอร์ชันของ DTO) |

The data is mapped from the domain models to the DTOs. By using DTOs, we can provide as many different versions (with different structures) of our entities as we want.

ข้อมูลถูก map จาก domain model ไปเป็น DTO และเราสร้าง DTO ได้กี่เวอร์ชัน (โครงสร้างต่างกัน) ของ entity เดียวก็ได้

ตัวอย่างในไฟล์นี้: entity **Product** หนึ่งตัว → Mapper → **Summary DTO** (ข้อมูลน้อย) และ **Detail/Full DTO** (ข้อมูลเต็ม) (สไลด์ 18)

### Entity vs DTO slide 11

| ชนิด | ฟิลด์ (ตามสไลด์) | ความหมาย |
| --- | --- | --- |
| **Database entity** | `id, name, email, password_hash, role, created_at` | แทนข้อมูลที่ **เก็บ** ไว้ |
| **User response DTO** | `id, name, email, role` | แทนข้อมูลที่ API **ส่งหรือรับ** |

Never return fields such as password_hash.

ห้ามส่งคืน field อย่าง password_hash ใน response

DTO ตัวอย่างตัด `password_hash` และ `created_at` ออก

### Summary slide 12

- Pagination ช่วยเรื่อง **performance** และ **usability** ของรายการขนาดใหญ่
- MySQL แบ่งหน้านิยมใช้ **LIMIT และ OFFSET**
- DTO สร้าง API contract ที่ **ชัดเจน ปลอดภัย และสม่ำเสมอ**
- แยก database entity ออกจาก API request/response object

Part E

## Practices: Pagination Middleware

slide 13–15

สไลด์ 13 คือหน้าคั่น "**Practices**" จากนั้นเป็นโค้ดตัวอย่างโปรเจกต์ Product (สไลด์ 14–23)

ส่วนเสริม · แผนที่ไฟล์ของตัวอย่าง (รวบรวมจากคอมเมนต์และ import ในสไลด์)

| ไฟล์ | หน้าที่ | สไลด์ |
| --- | --- | --- |
| `src/middlewares/pagination-middleware.js` | อ่าน page/limit คำนวณ offset ใส่ `req.pagination` | 14–15 |
| `src/repositories/product-repo.js` | SQL: `findAll`, `findOne`, `count` | 16–17 |
| `src/mappers/product-mapper.js` | แปลง entity → DTO (summary / detail) | 18–19 |
| `src/services/product-service.js` | ประสาน repository + mapper | 20 |
| `src/mappers/api-response.js` | ห่อ JSON response + pagination metadata | 21–22 |
| `src/routes/product-route.js` | Router (Controller) รับ request | 23 |
| `src/middlewares/error-handler.js` | มี `AppError` (ไฟล์ 06) | 16 (import) |

ชื่อ `product-repo.js` มาจาก import ในสไลด์ 20 ส่วนสไลด์ 16 ไม่ได้บอกชื่อไฟล์ของ repository

### Pagination Middleware slide 14

```
//src/middlewares/pagination-middleware.js
export const queryParser = () => {
    return (req, res, next) => {
        const query = req.query || {};
        if (!query || query.page == undefined || query.limit == undefined) {
            req.pagination = null
            return next();
        }
        let page = query.page || 1 //if empty, null set to 1
        const pageSize = query.limit || 20
        // console.log('page: ', page, 'size: ', pageSize)
        page = Math.max(parseInt(page), 1) //if page is negative
        const limit = Math.min(parseInt(pageSize), 100) //if page size > 100

        const offset = (page - 1) * pageSize
        req.pagination = {page, limit, offset}
        next();
    }
}
```

| ส่วนของโค้ด | ความหมาย |
| --- | --- |
| `export const queryParser = () => (req, res, next) => {...}` | factory คืน **middleware** (ไฟล์ 05, 06) |
| `query.page == undefined \|\| query.limit == undefined` | ถ้า client **ไม่ส่ง page หรือ limit อย่างใดอย่างหนึ่ง** → `req.pagination = null` แล้ว `next()` (ไม่แบ่งหน้า) |
| `page = Math.max(parseInt(page), 1)` | page อย่างต่ำ 1 (กันค่าติดลบ) |
| `limit = Math.min(parseInt(pageSize), 100)` | limit สูงสุด 100 (**safe limit**) |
| `offset = (page - 1) * pageSize` | คำนวณ offset |
| `req.pagination = {page, limit, offset}` | ส่งต่อให้ handler ชั้นถัดไปผ่านออบเจกต์ `req` |

ข้อสังเกต · offset ใช้ pageSize แทน limit บรรทัดคำนวณ offset ใช้ `pageSize` (ค่าที่ client ส่งมาดิบ ๆ) ไม่ใช่ `limit` ที่ถูกจำกัดแล้ว ถ้า client ขอ `limit=500` จะได้ `limit = 100` แต่ offset ยังคำนวณด้วย 500 ทำให้ข้ามแถวมากเกินจริง (ดูตารางส่วนเสริม) น่าจะควรเป็น `(page - 1) * limit` เหมือนสูตรในสไลด์ 4 และ `parseInt` ของข้อความที่ไม่ใช่ตัวเลขจะได้ `NaN` ซึ่ง `Math.max/min` ก็คืน `NaN`

ส่วนเสริม · ลองคำนวณตามโค้ดสไลด์ (ตัวอย่างสมมติ)

| คำขอ | page | limit | offset ที่โค้ดได้ | offset ที่ควรเป็น |
| --- | --- | --- | --- | --- |
| `?page=2&limit=20` | 2 | 20 | 20 | 20 |
| `?page=0&limit=20` | 1 | 20 | 0 | 0 |
| `?page=3&limit=500` | 3 | 100 | 1000 | 200 |
| `?page=2` (ไม่มี limit) | pagination = null → ดึง **ทุกแถว** | — |  |  |

แถวสุดท้ายแสดงว่า API จะไม่แบ่งหน้าเมื่อพารามิเตอร์ไม่ครบ ซึ่งขัดกับเจตนาของสไลด์ 3 ในงานจริงอาจกำหนดค่าเริ่มต้นแทน

### Use Pagination Middleware with app.js slide 15

```
import {queryParser} from "./middlewares/pagination-middleware.js";
const ID = '6852000A'
const app = express()
app.use(express.json())
app.use(queryParser()) //Must use before router


// Test queryParser
app.get('/', (req, res) => {
     console.log(req.pagination)
     res.json(req.pagination)
})
 :
 :
```

- `app.use(queryParser())` ต้องอยู่**ก่อน router** (**Must use before router**) เพราะ middleware ทำงานตามลำดับที่ลงทะเบียน
- ตัวอย่างทดสอบ: `app.get('/')` พิมพ์และส่งกลับ `req.pagination` เพื่อดูค่าที่คำนวณ

สไลด์พิมพ์ผิด / ไม่ครบ `const app express()` ในสไลด์ขาดเครื่องหมาย `=` (แก้แล้วในโค้ดด้านบน) ไม่มี `import express from 'express'` และ `const ID = '6852000A’` ใช้เครื่องหมายคำพูดโค้งและไม่ได้ถูกใช้ในโค้ดที่แสดง

ส่วนเสริม · ผลของการทดสอบ (สมมติ) เรียก `GET /?page=2&limit=20` จะได้ `{"page":2,"limit":20,"offset":20}` ส่วนเรียก `GET /` ไม่มี query จะได้ `null`

Part F

## Repository, Mapper, Service

slide 16–20

### Product Repository (1) slide 16

สไลด์มีกล่องเตือน "**> nmp install http-status**" ให้ติดตั้งแพ็กเกจ `http-status` (ใช้ค่าคงที่ เช่น `httpStatus.NOT_FOUND`)

```
import db from '../configs/db-config.js'
import {AppError} from "../middlewares/error-handler.js";
import httpStatus from "http-status";

const TABLE_NAME = "products"
const ENTITY_NAME = "Product"

const COUNT_ALL = `SELECT COUNT(*) as total FROM ${TABLE_NAME}`
const FIND_ALL_SQL = `SELECT * FROM ${TABLE_NAME}`
const FIND_ONE_SQL = `SELECT * FROM ${TABLE_NAME} WHERE productCode = ?`
const UPDATE_SQL = `UPDATE ${TABLE_NAME} SET ? WHERE productCode = ?`
const REMOVE_SQL = `DELETE FROM ${TABLE_NAME} WHERE productCode = ?`
const CREATE_SQL = `INSERT INTO ${TABLE_NAME} SET ?`

async function count() {
  const [[{ total }]] = await db.query(COUNT_ALL);
  return total;
}
```

| ค่าคงที่ | SQL |
| --- | --- |
| `COUNT_ALL` | นับทั้งหมด `COUNT(*) as total` |
| `FIND_ALL_SQL` | เลือกทุกแถวทุกคอลัมน์ |
| `FIND_ONE_SQL` | เลือกแถวเดียวด้วย `productCode = ?` |
| `UPDATE_SQL` | `UPDATE ... SET ? WHERE productCode = ?` |
| `REMOVE_SQL` | `DELETE ... WHERE productCode = ?` |
| `CREATE_SQL` | `INSERT INTO ... SET ?` |

สไลด์พิมพ์ผิด "**nmp** install http-status" ควรเป็น **npm** install http-status (พิมพ์ผิดซ้ำในสไลด์ 21)

มีการ import `AppError` จาก `error-handler.js` ซึ่งเชื่อมกับ Custom Error ในไฟล์ 06 และตัวอย่างในสไลด์นี้ยังไม่มีฟังก์ชันสร้าง/แก้/ลบ (มีแค่ SQL ที่เตรียมไว้)

### Product Repository (2) slide 17

findAll (เหมือนสไลด์ 6)

```
export async function findAll(pagination) {
  if (!pagination) {
     const [rows] = await db.query(FIND_ALL_SQL)
     return rows
  }
  const SQL = FIND_ALL_SQL + ' LIMIT ? OFFSET ?'
  const {limit, offset} = pagination
  const [rows] = await db.query(SQL, [limit, offset])
  rows.totalItems = await count()
  return rows
}
```

findOne (ใหม่)

```
export async function findOne(id) {
   const [row] = await db.query(FIND_ONE_SQL, [id])
   if (row.length === 0) {
       throw new AppError(
         `${ENTITY_NAME} with code '${id}' was not found`,
         httpStatus.NOT_FOUND
       )
   }
   return row[0]
}
```

- `findOne` ค้นด้วย `productCode` ถ้า**ไม่พบ** (`row.length === 0`) จะ `throw new AppError(..., httpStatus.NOT_FOUND)` (404) ตามแนวคิดไฟล์ 06
- ถ้าพบ คืน `row[0]` (แถวแรก) ไม่ใช่ array

การจัดวางสไลด์ ในสไลด์สองกล่องซ้อนทับกัน ทำให้ข้อความ `return rows` ของ `findAll` ดูเหมือนอยู่ผิดตำแหน่ง ผมรวมให้เป็นฟังก์ชันที่ถูกต้องตามสไลด์ 6

### Product Mapper (1) slide 18

```
// src/mappers/product-mapper.js
export default class ProductMapper {
  // แปลงเป็น Less Data DTO (Summary)
  static toSummaryDTO(entity) {
     return {
        id: entity.productCode,
        name: entity.productName,
        scale: entity.productScale,
        retailPrice: entity.MSRP,
     };
  }
  // แปลงเป็น Full Data DTO
  static toDetailDTO(entity) {
     const {MSRP,buyPrice, ...data} = entity
     data.retailPrice = MSRP
     data.price = buyPrice
     return data
  }
```

| เมธอด | ผลลัพธ์ (DTO) |
| --- | --- |
| `toSummaryDTO(entity)` (Less Data) | 4 ฟิลด์: `id` ← `productCode`, `name` ← `productName`, `scale` ← `productScale`, `retailPrice` ← `MSRP` |
| `toDetailDTO(entity)` (Full Data) | แยก `MSRP` และ `buyPrice` ออก ที่เหลือคัดลอกเข้า `data` (rest/spread) แล้วตั้ง `retailPrice = MSRP` และ `price = buyPrice` |

Mapper ทำ 2 อย่าง คือ **เปลี่ยนชื่อ field** ให้เหมาะกับ API (productCode → id ฯลฯ) และ **เลือกว่าส่งอะไรออก**

ส่วนเสริม · ข้อควรระวังของ toDetailDTO (สมมติ) `toDetailDTO` ใช้วิธี "ตัดสอง field แล้วส่งที่เหลือทั้งหมด" ต่างจาก `toSummaryDTO` ที่ระบุ field ทีละตัว ถ้าตารางมีคอลัมน์ลับเพิ่มภายหลัง (เช่น `password_hash` ในสไลด์ 11) คอลัมน์นั้นจะหลุดออกไปใน DTO แบบ full โดยอัตโนมัติ การระบุ field ที่อนุญาตทีละตัว (allowlist) ปลอดภัยกว่า

### Product Mapper (2) slide 19

```
  static maps(entities, viewType) {
     const {totalItems} = entities
     let entitiesMap = {}
     if(viewType == 'full') {
        entitiesMap = entities.map(item => this.toDetailDTO(item))
     } else {
        entitiesMap = entities.map(item => this.toSummaryDTO(item))
     }
     if(totalItems) {
        entitiesMap.totalItems = totalItems
     }
     return entitiesMap
  }

  static map(entity, viewType) {
     if(viewType == 'summary') {
         return this.toSummaryDTO(entity)
     } else {
         return this.toDetailDTO(entity)
     }
  }
}
```

| เมธอด | ใช้กับ | กฎเลือก DTO |
| --- | --- | --- |
| `maps(entities, viewType)` | รายการ (หลายแถว) | `viewType == 'full'` → Detail, **นอกนั้น** → Summary |
| `map(entity, viewType)` | แถวเดียว | `viewType == 'summary'` → Summary, **นอกนั้น** → Detail |

- `maps` ดึง `totalItems` ที่แปะไว้ใน array (สไลด์ 6) ก่อน แล้วแปะกลับบน array ใหม่ที่ map แล้ว เพราะ `.map()` สร้าง array ใหม่ที่ไม่มี property นี้
- ค่าปริยายต่างกัน: รายการ → ย่อ, รายการเดียว → เต็ม สอดคล้องกับ Router (สไลด์ 23)

ส่วนเสริม · กรณีขอบ `if(totalItems)` เป็น falsy เมื่อ `totalItems = 0` (ตารางว่าง) จึงไม่ถูกแปะกลับ ทำให้ `total` ใน metadata เป็น `undefined` และ `totalPages` เป็น `NaN` ควรเช็กด้วย `!== undefined` แทน

### Product Service slide 20

```
// src/services/product-service.js

import * as repo from "../repositories/product-repo.js"
import mapper from "../mappers/product-mapper.js"

export async function getObject(id,viewType) {
  return mapper.map(await repo.findOne(id));
}

export async function getAllObjects(pagination, viewType) {
  const objects = await repo.findAll(pagination)
  const objectsDto = mapper.maps(objects,viewType)
  console.log(objectsDto)
  return objectsDto
}
```

| ฟังก์ชัน | ลำดับงาน |
| --- | --- |
| `getObject(id, viewType)` | `repo.findOne(id)` → `mapper.map(entity)` |
| `getAllObjects(pagination, viewType)` | `repo.findAll(pagination)` → `mapper.maps(objects, viewType)` → `console.log` → คืน DTO |

ข้อสังเกต · viewType ไม่ถูกส่งต่อ ใน `getObject` เรียก `mapper.map(await repo.findOne(id))` โดย**ไม่ส่ง viewType** ทำให้ `viewType` เป็น `undefined` และได้ Detail DTO เสมอ ไม่ว่า client จะขอ `?view=summary` หรือไม่ น่าจะควรเป็น `mapper.map(await repo.findOne(id), viewType)` นอกจากนี้ `console.log(objectsDto)` เป็นโค้ด debug ที่ควรลบก่อนใช้งานจริง

Part G

## Api Response และ Router

slide 21–23

### Api Response (1) slide 21

ไฟล์ `src/mappers/api-response.js` ใช้ `http-status` (สไลด์เตือนให้ติดตั้งอีกครั้ง)

```
import httpStatus from "http-status";

export async function apiResponse(res, data, pagination = null, status = httpStatus.OK) {
  return await (pagination ?
      paginate(res, data, pagination, status.valueOf()) :
      success(res, data, status.valueOf())
  )
}

// ส่ง Success Response ทั่วไป
async function success(res, data, statusCode) {
   return res.status(statusCode).json({
       success: true,
       data: data,
       timestamp: new Date().toISOString(),
   });
}
```

| ส่วนของโค้ด | ความหมาย |
| --- | --- |
| `apiResponse(res, data, pagination = null, status = httpStatus.OK)` | จุดเดียวที่ handler เรียกเพื่อตอบ ค่าปริยาย: ไม่มี pagination และ status 200 |
| `pagination ? paginate(...) : success(...)` | มี pagination → ตอบแบบแบ่งหน้า ไม่มี → ตอบทั่วไป |
| `success(res, data, statusCode)` | ตอบ `{success: true, data, timestamp}` (timestamp เป็น ISO string) |

สไลด์พิมพ์ผิด "**nmp** install http-status" ควรเป็น npm

### Api Response (2) slide 22

```
// ส่ง Success Response สำหรับข้อมูลแบบ Paginated
async function paginate(res, data, pagination, statusCode) {
   const {limit, page} = pagination
   const total = data.totalItems;
   return res.status(statusCode).json({
       success: true,
       data,
       pagination: {
          total: total,
          page: page,
          limit: limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1
       },
       timestamp: new Date().toISOString()
   });
}
```

| ฟิลด์ metadata | วิธีคำนวณ |
| --- | --- |
| `total` | `data.totalItems` (ค่าที่ Repository แปะไว้ และ Mapper คัดลอกต่อ) |
| `page`, `limit` | จาก `pagination` ที่ middleware สร้าง |
| `totalPages` | `Math.ceil(total / limit)` |
| `hasNextPage` | `page * limit < total` |
| `hasPrevPage` | `page > 1` |

ไม่ตรงกับสไลด์ 7 ตัวอย่าง JSON ในสไลด์ 7 ใช้ชื่อ `totalItems` และ `hasPreviousPage` แต่โค้ดนี้สร้าง `total` และ `hasPrevPage` ชื่อ field ใน API จริงจึงต้องยึดตามโค้ด (หรือแก้ให้ตรงกัน) เพราะ client จะอ่านตามชื่อ

ส่วนเสริม · ตัวอย่างผลลัพธ์ตามโค้ด (สมมติข้อมูล) คำขอ `GET /api/products?page=2&limit=20` เมื่อมี 138 แถว จะได้ metadata

```
"pagination": { "total": 138, "page": 2, "limit": 20,
                "totalPages": 7, "hasNextPage": true, "hasPrevPage": true }
```

(`hasPrevPage` เป็น true เพราะ page = 2 > 1)

### Product Router slide 23

```
// src/routes/product-route.js
import * as service from "../services/product-service.js"
import express from "express"
import {apiResponse} from "../mappers/api-response.js";

const router = express.Router()

router.get("/", async (req, res) => {
   const pagination = req.pagination
   const viewType = req.query.view || "summary"
   const objects = await service.getAllObjects(pagination, viewType)
   apiResponse(res, objects, pagination)
})

router.get("/:id", async (req, res) => {
   const viewType = req.query.view || "full"
   const id = req.params.id
   const object = await service.getObject(id,viewType)

   apiResponse(res, object)
})
```

| Route | ขั้นตอน | view ปริยาย |
| --- | --- | --- |
| `GET /` | อ่าน `req.pagination` (จาก middleware) และ `req.query.view` → `service.getAllObjects` → `apiResponse(res, objects, pagination)` | **summary** |
| `GET /:id` | อ่าน `req.params.id` และ `req.query.view` → `service.getObject` → `apiResponse(res, object)` | **full** |

- **Router** ทำหน้าที่ Controller ตามหลัก layer: รับ request, เรียก service, ส่ง response ผ่าน `apiResponse` ไม่มีข้อมูลหรือ SQL อยู่ในชั้นนี้
- เมื่อ client ไม่ส่ง `page` และ `limit`, `pagination` เป็น `null` ทำให้ `apiResponse` ตอบแบบ `success` (ไม่มี metadata)

ส่วนเสริม · เชื่อมกับไฟล์ 06 และ 05 handler ในสไลด์เป็น `async` แต่ไม่มี `try..catch` หรือ `next(err)` ถ้า `findOne` โยน `AppError` (404) ใน Express 4 จะไม่ถูกส่งเข้า error-handling middleware อัตโนมัติ ต้องจับแล้ว `next(err)` เอง (Express 5 ส่งให้เอง) และจำไว้ว่า router นี้ต้องถูก mount ด้วย `app.use('/api/products', router)` **หลัง** `queryParser()` (สไลด์ 15) สไลด์ไม่ได้แสดงบรรทัด mount และไม่มี `export default router`

สรุป

## ภาพรวมและประเด็นสอบ

ภาพรวมที่เชื่อมกัน: request `?page=2&limit=20` ผ่าน **Pagination Middleware** (คำนวณ offset → `req.pagination`) → **Router** → **Service** → **Repository** (SQL `LIMIT ? OFFSET ?` + `COUNT(*)`) → **Mapper** (entity → DTO) → **apiResponse** (ห่อด้วย `success`, `data`, `pagination`, `timestamp`) แต่ละชั้นรับผิดชอบเรื่องเดียวตามหลัก Layered System

### ประเด็นที่ต้องจำสำหรับสอบ

- เหตุผลที่ต้อง pagination: response ใหญ่ → กิน DB, memory, network; pagination ทำให้ขนาดคาดเดาได้
- พารามิเตอร์: `page`, `limit` (client ส่ง), `offset` (คำนวณ) และ **OFFSET = (page − 1) × limit** (page 9, limit 10 → offset 80, take 81–90)
- Flow: Client → route/middleware validate → คำนวณ offset → MySQL `LIMIT ... OFFSET ...` → ส่ง items + metadata
- ต้องมี `COUNT(*)` เพื่อได้ **totalItems** → คำนวณ **totalPages = ⌈total / limit⌉**, **hasNextPage = page × limit \< total**, **hasPrevPage = page > 1**
- Best practices: page ≥ 1, max limit (เช่น 100), prepared statements, index คอลัมน์ filter/sort, พิจารณา **cursor pagination** เมื่อหน้าลึกมาก
- DTO: object กำหนดข้อมูลที่แลกเปลี่ยนระหว่างชั้น API; แยก API contract ออกจาก database model
- ประโยชน์ DTO: กันข้อมูลลับหลุด, response สม่ำเสมอ, validate/document ง่าย, ลด coupling
- Entity (เก็บข้อมูล: มี `password_hash`, `created_at`) ต่างจาก DTO (ส่ง/รับข้อมูล: `id, name, email, role`) และห้ามส่ง `password_hash`
- Mapper ทำ 2 view: Summary (4 ฟิลด์) และ Detail/Full; รายการ default = summary, รายการเดียว default = full
- `app.use(queryParser())` ต้องมาก่อน router

### Key Terms

**Pagination**การแบ่งหน้าข้อมูล

**page**หน้าที่ขอ

**limit**จำนวน record ต่อหน้า

**offset**จำนวน record ที่ข้าม = (page−1)×limit

**LIMIT / OFFSET**คำสั่ง MySQL แบ่งหน้า

**COUNT(\*)**นับแถวทั้งหมด

**ORDER BY**เรียงผลลัพธ์

**totalItems / total**จำนวนทั้งหมด

**totalPages**จำนวนหน้าทั้งหมด

**hasNextPage / hasPrevPage**มีหน้าถัดไป / ก่อนหน้า

**Cursor pagination**แบ่งหน้าด้วยค่าแถวสุดท้าย เหมาะกับหน้าลึก

**Prepared statement**SQL ที่ใช้ ? แทนค่า

**Index**ดัชนีช่วยค้นหา/เรียงเร็ว

**DTO**Data Transfer Object

**Entity**ข้อมูลที่เก็บใน DB

**Request / Response DTO**DTO ขาเข้า / ขาออก

**Mapper**แปลง entity ↔ DTO

**API contract**รูปแบบข้อมูลที่ตกลงกับ client

**queryParser**middleware สร้าง req.pagination

**apiResponse**ฟังก์ชันห่อ JSON response

ที่มา: ไฟล์ 07-INT161-Pagination and DTO.pdf (INT161 Basic Backend Development, Week-07) ครบทั้ง 23 สไลด์ · โค้ด ตาราง และแผนภาพมาจากสไลด์ · กล่อง "ส่วนเสริม" (เส้นประเหลือง) คือเนื้อหาที่เพิ่มเอง ได้แก่ ORDER BY, ตัวอย่างคำนวณ offset, ข้อสังเกตเรื่อง prepared statement และ cursor pagination, แผนที่ไฟล์, ตารางทดลอง queryParser, ข้อควรระวังของ Mapper, กรณีขอบ totalItems = 0, ผลลัพธ์ตัวอย่างของ paginate และเรื่อง error ใน Express 4/5 ; ชื่อ product-repo.js อ้างจาก import ในสไลด์ 20 · กล่องแดงคือจุดที่สไลด์พิมพ์ผิดหรือไม่สอดคล้องกัน