import express from "express"
import { addToCart,removeFromCart,getUserCart,updateCartQuantity } from "../Controller/Cartcontroller.js"
import authMiddleware from "../Middleware/authMiddleware.js"
const cartRouter=express.Router()

cartRouter.post("/addtocart",authMiddleware,addToCart )
cartRouter.delete("/remove",authMiddleware,removeFromCart)
cartRouter.get("/mycart",authMiddleware,getUserCart)
cartRouter.post("/update",authMiddleware,updateCartQuantity)

export default cartRouter