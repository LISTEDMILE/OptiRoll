const mongoose = require("mongoose");

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
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentUser",
      required: true,
    },
  ],
  attendence: {
    whatNext: {
      type: String,
      default:"start"
    },
    startTime: {
      type: String,
    },
    data: {
      type: Array,
      default:[]
    }
  }
});

adminSchema.post("findOneAndDelete", async function (doc) {
  if (doc && doc.students && doc.students.length > 0) {
    const StudentUser = mongoose.model("StudentUser");
    await StudentUser.deleteMany({ _id: { $in: doc.students } });
  }
});

module.exports = mongoose.model("AdminUser", adminSchema);
