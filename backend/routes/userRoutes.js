const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Order = require("../models/order");
// ---------------- Signup ----------------
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user with correct field names
    const user = await User.create({ username, email, password, phone });

    // Return success message and user details for frontend
    res.json({
      message: "Signup Successful",
      user: {
        name: user.username, // frontend expects 'name'
        email: user.email,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).json({ message: err.message });
  }
});

// ---------------- Signin ----------------
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Send JSON response with user details for Profile.jsx
    res.json({
      message: "Login Successful",
      user: {
        name: user.username,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// ---------------- Get all orders for a user ----------------
// __define-ocg__ fetch all orders placed by this user
router.get("/:userId/orders", async (req, res) => {
  try {
    const varOcg = req.params.userId; // 👈 user ID
    const orders = await Order.find({ user: varOcg })
      .populate("restaurant", "restaurantName") // optional: show which restaurant
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: "Server error fetching user orders" });
  }
});
module.exports = router;
