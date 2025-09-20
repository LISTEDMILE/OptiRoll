const express = require("express");
const multer = require("multer");
const adminController = require("../controllers/adminController");
const adminRouter = express.Router();

// Use memory storage for Multer
const upload = multer({ storage: multer.memoryStorage() }).array("images", 5);

adminRouter.post("/addStudent", upload, adminController.addStudentPost);

adminRouter.post("/studentsList", adminController.adminStudentList);
adminRouter.post("/studentDashboard/:sid", adminController.adminStudentDashboard);
adminRouter.post("/editStudentDashboard/:sid", adminController.editStudentDashboard);
adminRouter.post("/deleteStudent/:sid", adminController.deleteStudent);
adminRouter.post("/studentAttendence/:sid", adminController.adminStudentAttencence);
adminRouter.post("/adminAttendence", adminController.adminAdminAttencence);

module.exports = adminRouter;
