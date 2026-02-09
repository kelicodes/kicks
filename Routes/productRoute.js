import { productUpload,fecthAll,fetchone,Deleteproduct } from "../Controller/productModel";
import upload from "../Middleware/multer.js";
import express from "express"

const productRouter = express.Router();

// ------------------ Routes ------------------

// Upload product images
productRouter.post(
  "/upload",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  productUpload
);

productRouter.get("/all",fecthAll)
productRouter.delete("/delete",Deleteproduct)
productRouter.get('/product/:id', fetchone)

export default productRouter

