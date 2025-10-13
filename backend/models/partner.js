const mongoose = require("mongoose");

const PartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },             // partner full name
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: true },         // store hashed password
  phone: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Partner", PartnerSchema);
