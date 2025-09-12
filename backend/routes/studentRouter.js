const express = require("express");
const studentController = require("../controllers/studentController");
const studentRouter = express.Router();

studentRouter.post("/studentDashboard", studentController.studentStudentDashboard);
studentRouter.post("/editStudentDashboard", studentController.editStudentDashboard);
studentRouter.post("/studentAttendence", studentController.studentStudentAttencence);

module.exports = studentRouter;