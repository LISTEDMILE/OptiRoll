const mongoose = require("mongoose");
const StudentUser = require("../models/studentModel");

const adminSchema = new mongoose.Schema({
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
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudentUser",
    required: true
  }
  ],
});

module.exports = mongoose.model("AdminUser", adminSchema);
