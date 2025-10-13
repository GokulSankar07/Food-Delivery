const express = require("express");
const router = express.Router();
const partnerController = require("../controllers/partnerController");

// Auth Routes
router.post("/signup", partnerController.signup);
router.post("/login", partnerController.login);

// Partner Order Routes
router.get("/partner/orders/:partnerId", partnerController.getOrders);
router.put("/partner/orders/:orderId/deliver", partnerController.markDelivered);

module.exports = router;
