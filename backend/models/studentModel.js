const mongoose = require("mongoose");

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
    required: [true, "Password is requijred"],
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUser",
    required: true,
  },
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

studentSchema.pre("findOneAndDelete", async function (next) {
  const queryId = this.getQuery()["_id"];
  const studentId =
    typeof queryId === "string"
      ? new mongoose.Types.ObjectId(queryId)
      : queryId;
  const AdminUser = mongoose.model("AdminUser");
  await AdminUser.findOneAndUpdate(
    {
      students: studentId,
    },
    { $pull: { students: studentId } }
  );
  next();
});

module.exports = mongoose.model("StudentUser", studentSchema);
