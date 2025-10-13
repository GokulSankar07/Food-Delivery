const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true }, // must match frontend
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone:    { type: String },

    // Orders linked to this user
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }]

});

module.exports = mongoose.model("User", UserSchema, "users"); // collection: users
