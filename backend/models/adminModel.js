const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required:[true,"Name is required"]
        },
        email: {
            type: String,
            required:[true,"Enter your Email"]
        },
        password: {
            type: String,
            required:[true,"Password is required"]
        },


    }
)

module.exports = mongoose.model("AdminUser", adminSchema);