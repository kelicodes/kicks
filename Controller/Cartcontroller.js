import Cart from "../Models/cartModel.js";
import mongoose from "mongoose";

// -------------------- Add to Cart --------------------
export const addToCart = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;
    const userId = req.userId; // <- from authMiddleware

    if (!productId || !size) {
      return res.status(400).json({ success: false, message: "Product and size are required" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, size, quantity: quantity || 1 }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId && item.size === size
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity || 1;
      } else {
        cart.items.push({ productId, size, quantity: quantity || 1 });
      }
    }

    await cart.save();
    return res.status(200).json({ success: true, message: "Product added to cart", cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to add to cart", error: error.message });
  }
};

// -------------------- Remove from Cart --------------------
export const removeFromCart = async (req, res) => {
  try {
    const { productId, size } = req.body;
    const userId = req.userId; // <- from authMiddleware

    if (!productId || !size) {
      return res.status(400).json({ success: false, message: "Product and size are required" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => !(item.productId.toString() === productId && item.size === size)
    );

    await cart.save();
    return res.status(200).json({ success: true, message: "Product removed from cart", cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to remove from cart", error: error.message });
  }
};

// -------------------- Update Quantity --------------------
export const updateCartQuantity = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;
    const userId = req.userId; // <- from authMiddleware

    if (!productId || !size || quantity < 1) {
      return res.status(400).json({ success: false, message: "All fields are required and quantity must be >= 1" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    return res.status(200).json({ success: true, message: "Quantity updated", cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to update cart", error: error.message });
  }
};

// -------------------- Get User Cart --------------------
export const getUserCart = async (req, res) => {
  try {
    const userId = req.userId; // <- from authMiddleware

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to fetch cart", error: error.message });
  }
};
