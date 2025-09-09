const express = require("express");
const adminController = require("../controllers/adminController");
const adminRouter = express.Router();

adminRouter.post("/addStudent", adminController.addStudentPost);
adminRouter.post("/studentsList", adminController.adminStudentList);
adminRouter.post("/studentDashboard/:sid", adminController.adminStudentDashboard);
adminRouter.post("/editStudentDashboard/:sid", adminController.editStudentDashboard);
adminRouter.post("/deleteStudent/:sid", adminController.deleteStudent);

module.exports = adminRouter;
