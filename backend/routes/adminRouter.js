const express = require("express");
const adminController = require("../controllers/adminController");
const adminRouter = express.Router();


adminRouter.post("/addStudent", adminController.addStudentPost);
adminRouter.post("/studentsList", adminController.adminStudentList);

module.exports = adminRouter;