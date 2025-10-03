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
    required: [true, "Password is required"],
  },
  rollNumber: {
    type: String,
    required: [true, "Roll Number is required"],
    unique: true,
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Date of Birth is required"],
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  phone: {
    type: String,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  profilePicture: {
    type: String,
  },
  course: {
    type: String,
  },
  year: {
    type: Number,
  },
  section: {
    type: String,
  },
  parentName: {
    type: String,
  },
  parentPhone: {
    type: String,
  },
  parentEmail: {
    type: String,
  },
  emergencyContact: {
    name: String,
    relation: String,
    phone: String,
  },
  hobbies: {
    type: [String], // Array of hobbies
  },
  bio: {
    type: String,
  },
  skills: {
    type: [String], // Array of skills
  },
  achievements: {
    type: [String], // Array of achievements
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUser",
    required: true,
  },
  faceEncoding: [[Number]],
  attendence: {
    whatNext: {
      type: String,
      default: "start",
    },
    startTime: {
      type: String,
    },
    data: {
      type: Array,
      default: [],
    },
  },
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
