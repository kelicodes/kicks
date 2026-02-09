import express from "express"
import { logout,userLogin,userReg } from "../Controller/usercontroller.js"

const userRouter= express.Router()

userRouter.post("/login",userLogin)
userRouter.post("/userReg",userReg)
userRouter.post("/logout",logout)


export default userRouter