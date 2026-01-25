const express = require("express");
const studentController = require("../controllers/studentController");
const studentRouter = express.Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() }).fields([
  { name: "profilePicture", maxCount: 1 }, // student can upload 1 profile picture
]);

studentRouter.post(
  "/studentDashboard",
  studentController.studentStudentDashboard,
);
studentRouter.post(
  "/editStudentDashboard",
  upload,
  studentController.editStudentDashboard,
);
studentRouter.post(
  "/studentAttendence",
  studentController.studentStudentAttencence,
);

module.exports = studentRouter;
