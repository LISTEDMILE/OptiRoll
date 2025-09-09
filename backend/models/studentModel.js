const mongoose = require("mongoose");
const AdminUser = require("../models/adminModel");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Enter your Email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUser",
    required: true,
  },
});

module.exports = mongoose.model("StudentUser", studentSchema);
