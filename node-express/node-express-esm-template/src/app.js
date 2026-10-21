import express from 'express'
import officeRouter from './routes/office-route.js'
import productLineRouter from "./routes/productline-route.js";
import productRouter from "./routes/product-route.js";
import brandsRouter from "./routes/brands-route.js"
import productsRouter from "./routes/product-route.js"

import {errorHandler} from "./middlewares/error-handler.js";
import {queryParser} from "./middlewares/pagination-middleware.js";

const ID = "67130500003"
const app = express()
app.use(express.json())
app.use(queryParser())

// Test queryParser
app.get(`/api/${ID}/student-info`, (req, res) => {
    res.json({
      success: true,
      data: {
        studentId: "67130500003",
        name: "Kittikorn Phaen",
        secretKey: "13KiPh"
      },
      timestamp: new Date()
    })
})


app.use(`/api/${ID}/offices`, officeRouter)
app.use(`/api/${ID}/productlines`, productLineRouter)
app.use(`/api/${ID}/products`, productRouter)
app.use(`/api/${ID}/brands`, brandsRouter)


app.listen(3000, () => {
    console.log('Example app listening on port 3000')
})

app.use(errorHandler)