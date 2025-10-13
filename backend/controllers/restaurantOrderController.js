const Order = require("../models/order");

// Get all orders for a restaurant
exports.getOrdersForRestaurant = async (req, res) => {
  try {
    const orders = await Order.find({ restaurant: req.params.restaurantId })
      .populate("user", "username email"); // populate user info
    res.json(orders);
  } catch (err) {
    console.error("Error fetching restaurant orders:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    // Populate user info for response
    const updatedOrder = await Order.findById(order._id).populate("user", "username email");
    res.json(updatedOrder);
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ message: "Server error" });
  }
};