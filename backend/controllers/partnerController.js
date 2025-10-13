const DeliveryPartner = require("../models/partner");
const bcrypt = require("bcryptjs");
const Order = require("../models/order");
exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone, vehicleNumber, address } = req.body;

    // check if already exists
    const existing = await DeliveryPartner.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Partner already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const partner = new DeliveryPartner({
      name,
      email,
      password: hashedPassword,
      phone,
      vehicleNumber,
      address,
    });

    await partner.save();
    res.status(201).json({ message: "Signup Successful", partner });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const partner = await DeliveryPartner.findOne({ email });
    if (!partner) return res.status(400).json({ message: "Partner not found" });

    const isMatch = await bcrypt.compare(password, partner.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    res.json({ message: "Login Successful", partner });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ---------------- ORDER CONTROLLERS ----------------

// Fetch all orders assigned to this partner
exports.getOrders = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const orders = await Order.find({ assignedPartner: partnerId });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this partner" });
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark a specific order as delivered
exports.markDelivered = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: "Delivered" },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order marked as delivered", updatedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};