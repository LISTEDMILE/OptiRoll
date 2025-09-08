const express = require("express");
const adminController = require("../controllers/adminController");
const adminRouter = express.Router();


adminRouter.post("/addStudent", adminController.addStudentPost);

module.exports = adminRouter;