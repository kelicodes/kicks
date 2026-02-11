import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import DB from "./Config/db.js"
import "dotenv/config"
import userRouter from "./Routes/userRouter.js"
import cartRouter from "./Routes/cartRoutes.js"
import productRouter from "./Routes/productRoute.js"



const app=express()
const port= process.env.PORT || 4000
DB()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://kicks-ekpr.onrender.com" // optional (production frontend)
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use("/user",userRouter)
app.use("/cart",cartRouter)
app.use("/product",productRouter)

app.get("/",(req,res)=>{
    res.send("api is running")
})

app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})