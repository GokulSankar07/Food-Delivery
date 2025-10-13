const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        id: Number,
        name: String,
        price: Number,
        image: String,
      },
    ],

    total: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Order Placed", "Accepted", "On the Way", "Delivered", "Cancelled"],
      default: "Order Placed",
    },

    // Reference to the user who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Reference to the restaurant receiving the order
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    // ✅ Reference to the delivery partner assigned to this order
    assignedPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPartner",
      default: null, // will be set when a partner accepts the delivery
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
