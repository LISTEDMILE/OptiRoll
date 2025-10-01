const express = require("express");
const multer = require("multer");
const adminController = require("../controllers/adminController");
const adminRouter = express.Router();

// Use memory storage for Multer
const upload = multer({ storage: multer.memoryStorage() }).fields([
  { name: "profilePicture", maxCount: 1 }, // single profile picture
  { name: "images", maxCount: 5 }, // 3–5 webcam captures
]);

adminRouter.post("/addStudent", upload, adminController.addStudentPost);

adminRouter.post("/studentsList", adminController.adminStudentList);
adminRouter.post(
  "/studentDashboard/:sid",
  adminController.adminStudentDashboard
);
adminRouter.post(
  "/editStudentDashboard/:sid",upload,
  adminController.editStudentDashboard
);
adminRouter.post("/deleteStudent/:sid", adminController.deleteStudent);
adminRouter.post(
  "/studentAttendence/:sid",
  adminController.adminStudentAttencence
);
adminRouter.post("/adminAttendence", adminController.adminAdminAttencence);

module.exports = adminRouter;
