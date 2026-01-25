const express = require("express");
const multer = require("multer");
const teacherController = require("../controllers/teacherController");

const teacherRouter = express.Router();

// Use memory storage for Multer
const upload = multer({ storage: multer.memoryStorage() }).single("faceImage"); // single image from webcam

teacherRouter.post(
  "/markAttendance",
  upload,
  teacherController.teacherMarkAttendence,
);
teacherRouter.post("/statusMarking", teacherController.statusMarking);
teacherRouter.post("/startMarking", teacherController.startMarking);

module.exports = teacherRouter;
