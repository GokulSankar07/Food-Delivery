const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const User = require("../models/users");
const Restaurant = require("../models/restaurant");

// ---------------- Create a new order ----------------
router.post("/", async (req, res) => {
  try {
    const { items, total, user, restaurant } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }
    if (!user) return res.status(400).json({ message: "User is required" });
    if (!restaurant)
      return res.status(400).json({ message: "Restaurant is required" });

    const newOrder = new Order({
      items,
      total,
      status: "Order Placed",
      user,
      restaurant,
    });

    await newOrder.save();

    // Update user & restaurant documents
    await User.findByIdAndUpdate(user, { $push: { orders: newOrder._id } });
    await Restaurant.findByIdAndUpdate(restaurant, {
      $push: { orders: newOrder._id },
    });

    // Populate for response
    const populatedOrder = await Order.findById(newOrder._id)
      .populate("user", "username email")
      .populate("restaurant", "restaurantName address");

    // ---------------- Emit only to restaurant room ----------------
    const io = req.app.get("io");
    if (io) {
      console.log(`📡 Emitting new order to restaurant ${restaurant}`);
      io.to(restaurant).emit("orderUpdate", populatedOrder);
    }

    res.status(201).json(populatedOrder);
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- Get an order by ID ----------------
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "username email")
      .populate("restaurant", "restaurantName address");

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error("❌ Error fetching order:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- Get all orders for a restaurant ----------------
router.get("/restaurant/:restaurantId", async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;

    if (!restaurantId)
      return res.status(400).json({ message: "Restaurant ID is required" });

    const orders = await Order.find({ restaurant: restaurantId })
      .populate("user", "username email")
      .populate("restaurant", "restaurantName address")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching restaurant orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
