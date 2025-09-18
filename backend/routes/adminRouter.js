const express = require("express");
const adminController = require("../controllers/adminController");
const adminRouter = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }); 

adminRouter.post("/admin/addStudent", upload.array("images", 5), addStudentPost);

adminRouter.post("/studentsList", adminController.adminStudentList);
adminRouter.post("/studentDashboard/:sid", adminController.adminStudentDashboard);
adminRouter.post("/editStudentDashboard/:sid", adminController.editStudentDashboard);
adminRouter.post("/deleteStudent/:sid", adminController.deleteStudent);
adminRouter.post("/studentAttendence/:sid", adminController.adminStudentAttencence);
adminRouter.post("/adminAttendence", adminController.adminAdminAttencence);

module.exports = adminRouter;
