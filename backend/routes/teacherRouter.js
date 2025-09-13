const express = require("express");
const teacherController = require("../controllers/teacherController");
const teacherRouter = express.Router();

teacherRouter.post("/markAttendance", teacherController.teacherMarkAttendence);
teacherRouter.post("/statusMarking", teacherController.statusMarking);
teacherRouter.post("/startMarking", teacherController.startMarking);

module.exports = teacherRouter;
