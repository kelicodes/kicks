import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import DB from "./Config/db.js"
import "dotenv/config"
import userRouter from "./Routes/userRouter.js"
import cartRouter from "./Routes/cartRoutes.js"



const app=express()
const port= process.env.PORT || 4000
DB()

app.use(express.json())
app.use(cookieParser())

app.use("/user",userRouter)
app.use("/cart",cartRouter)

app.get("/",(req,res)=>{
    res.send("api is running")
})

app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})