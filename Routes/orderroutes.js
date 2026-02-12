import express from "express";
import { placeOrder } from "../Controller/ordercontroller.js"
import authMiddleware from "../Middleware/authMiddleware.js"

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);

export default orderRouter;
