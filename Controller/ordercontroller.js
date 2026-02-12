import Order from "../Models/ordermodel.js"
import Cart from "../Models/cartModel.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.userId; // from authMiddleware
    const { paymentMethod } = req.body;

    // Find user cart
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Calculate total
    const totalAmount = cart.items.reduce(
      (acc, item) => acc + item.productId.price * item.quantity,
      0
    );

    // Create order
    const order = new Order({
      userId,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        size: item.size,
        quantity: item.quantity,
      })),
      totalAmount,
      paymentMethod: paymentMethod || "cod",
    });

    await order.save();

    // Optional: Clear cart after order
    cart.items = [];
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to place order", error: error.message });
  }
};
