import express from "express";
import { placeOrder } from "../Controllers/orderController.js";
import authMiddleware from "../Middleware/authMiddleware.js"

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);

export default orderRouter;
