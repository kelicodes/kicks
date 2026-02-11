import Product from "../Models/productModel.js";
import cloudinary from "../Config/cloudinary.js";
import fs from "fs";

export const productUpload = async (req, res) => {
  try {
    const { name, price, category, desc, sizes } = req.body;

    // Validate required fields
    if (!name || !price || !category || !desc || !sizes) {
      return res.status(400).json({
        success: false,
        message: "All fields including sizes are required",
      });
    }

    // Parse sizes
    let parsedSizes;
    try {
      parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid sizes format",
      });
    }

    if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one size is required",
      });
    }

    // Validate each size object
    for (const s of parsedSizes) {
      if (!s.size || s.stock === undefined) {
        return res.status(400).json({
          success: false,
          message: "Each size must have size and stock",
        });
      }
    }

    const uploadedImages = [];

    // Upload images to Cloudinary
    for (const key of ["image1", "image2", "image3", "image4"]) {
      if (req.files?.[key]?.[0]) {
        const filePath = req.files[key][0].path;

        const result = await cloudinary.uploader.upload(filePath, {
          folder: "products",
        });

        uploadedImages.push(result.secure_url);

        // Remove temp file if exists
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    if (uploadedImages.length < 1) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // Save product
    const newProduct = new Product({
      name,
      price,
      category,
      desc,
      images: uploadedImages,
      sizes: parsedSizes,
    });

    await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product uploaded successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Product upload failed",
      error: error.message,
    });
  }
};




export const fecthAll=async(req,res)=>{
    try {
        const allproducts= await Product.find()
        return res.json({success:true,message:"product fetched", allproducts})
    } catch (error) {
         console.error(error);
    return res.status(500).json({
      success: false,
      message: "Product fetcha;; failed",
      error: error.message,
    });
    }
}


export const fetchone=async(req,res)=>{
    try {
        const {id}=req.params

        const theproduct=await Product.findById(id)
        return res.json({success:true,message:"product fecthed", theproduct})
    } catch (error) {
         console.error(error);
    return res.status(500).json({
      success: false,
      message: "Product fetcha;; failed",
      error: error.message,
    });
    }
}


export const Deleteproduct=async(req,res)=>{
    try {
        const {id}= req.params
        await Product.findByIdAndDelete({id})
        return res.json({success:true,message:"product deleted"})

    } catch (error) {
        console.error(error);
    return res.status(500).json({
      success: false,
      message: "Product fetcha;; failed",
      error: error.message,
    });
    }
}