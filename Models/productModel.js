import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true
    },

    desc: {
      type: String,
      required: true
    },

    images: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one image is required"
      }
    },

    category: {
      type: String,
      required: true
    },

    brand: {
      type: String,
      required: true,
      trim: true
    },

    sizes: {
      type: [
        {
          size: {
            type: String, // "40", "41", "42", "US 9"
            required: true
          },
          stock: {
            type: Number,
            required: true,
            min: 0
          }
        }
      ],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Product must have at least one size"
      }
    },

    availability: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
