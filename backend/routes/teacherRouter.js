const express = require("express");
const teacherController = require("../controllers/teacherController");
const teacherRouter = express.Router();

teacherRouter.post("/markAttendance", teacherController.teacherMarkAttendence);

module.exports = teacherRouter;
