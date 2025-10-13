const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const http = require("http");
const { Server } = require("socket.io");

// Models
const User = require("./models/users");
const Order = require("./models/order");
const Restaurant = require("./models/restaurant");

// Routes
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const partnerRoutes = require("./routes/partnerRoutes");
const restaurantOrderRoutes = require("./routes/restaurantOrderRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// ---------------- MongoDB Connection ----------------
mongoose
  .connect("mongodb://127.0.0.1:27017/food_delivery")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ---------------- Create HTTP + Socket.IO Server ----------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // You can restrict to your frontend URL later
});

// Make io accessible in all routes
app.set("io", io);

// ---------------- Routes ----------------
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/partner", partnerRoutes);
app.use("/api", restaurantOrderRoutes);

// ---------------- Socket.IO Events ----------------
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ---------------- User Signup ----------------
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name: username,
      email,
      password,
      phone,
    });

    res.json({
      message: "Signup Successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ---------------- User Signin ----------------
app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.password !== password)
      return res.status(401).json({ message: "Invalid email or password" });

    res.json({
      message: "Login Successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- Restaurant Signup ----------------
app.post("/api/restaurants/register", async (req, res) => {
  try {
    const { ownerName, email, password, phone, restaurantName, address } =
      req.body;
    const existing = await Restaurant.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Restaurant already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newRestaurant = new Restaurant({
      ownerName,
      email,
      password: hashedPassword,
      phone,
      restaurantName,
      address,
      menu: [],
    });
    await newRestaurant.save();

    res.status(201).json({
      message: "Restaurant registered successfully",
      restaurant: {
        _id: newRestaurant._id,
        ownerName: newRestaurant.ownerName,
        email: newRestaurant.email,
        phone: newRestaurant.phone,
        restaurantName: newRestaurant.restaurantName,
        address: newRestaurant.address,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- Restaurant Signin ----------------
app.post("/api/restaurants/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    const isMatch = await bcrypt.compare(password, restaurant.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    res.json({
      message: "Login successful",
      restaurant: {
        _id: restaurant._id,
        ownerName: restaurant.ownerName,
        email: restaurant.email,
        phone: restaurant.phone,
        restaurantName: restaurant.restaurantName,
        address: restaurant.address,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- Restaurant Update Settings ----------------
app.post("/api/restaurants/update", async (req, res) => {
  try {
    const { _id, ...updateData } = req.body;
    if (!_id)
      return res
        .status(400)
        .json({ success: false, message: "Restaurant ID missing" });

    const updated = await Restaurant.findByIdAndUpdate(_id, updateData, {
      new: true,
    });
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });

    res.json({ success: true, restaurant: updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------------- Start Server ----------------
const PORT = 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
