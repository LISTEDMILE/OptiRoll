const express = require("express");
const authController = require("../controllers/authController");
const authRouter = express.Router();

authRouter.post("/login", authController.getLogin);
authRouter.post("/signUp", authController.postSignUp);
authRouter.post("/logout", authController.postLogOut);
authRouter.post("/deleteAccount", authController.postDeleteAccount);

module.exports = authRouter;
