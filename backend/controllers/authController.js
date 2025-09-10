const { check, validationResult } = require("express-validator");
const AdminUser = require("../models/adminModel");
const StudentUser = require("../models/studentModel");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

exports.getLogin = async (req, res, next) => {
  const { email, password, loginType } = req.body;
  try {
    if (loginType === "student") {
      const studentUser = await StudentUser.findOne({ email: email });
      if (!studentUser) {
        return res.status(401).json({
          errors: ["Invalid Credentials."],
          oldInputs: {
            email: email,
            password: password,
            loginType: loginType,
          },
        });
      }

      const isMatch = (password === studentUser.password);
      if (!isMatch) {
        return res.status(401).json({
          errors: ["Invalid Credentials."],
          oldInputs: {
            email: email,
            password: password,
            loginType: loginType,
          },
        });
      }

      req.session.regenerate((err) => {
  if (err) {
          console.error("Session save error : ", err);
          return res.status(500).json({
            errors: ["An error occured."],
          });
        }

req.session.isLoggedIn = true;
      req.session.StudentUser = studentUser;
        req.session.loginType = loginType;
        

         res.status(200).json({
      message: "Login Successful",
    });

});

    
    }
    
    else {
      const adminUser = await AdminUser.findOne({ email: email });
      if (!adminUser) {
        return res.status(401).json({
          errors: ["Invalid Credentials."],
          oldInputs: {
            email: email,
            password: password,
            loginType: loginType,
          },
        });
      }

      const isMatch = await bcrypt.compare(password, adminUser.password);
      if (!isMatch) {
        return res.status(401).json({
          errors: ["Invalid Credentials."],
          oldInputs: {
            email: email,
            password: password,
            loginType: loginType,
          },
        });
      }
      
      req.session.regenerate((err) => {
  if (err) {
          console.error("Session save error : ", err);
          return res.status(500).json({
            errors: ["An error occured."],
          });
        }

req.session.isLoggedIn = true;
      req.session.AdminUser = adminUser;
        req.session.loginType = loginType;
        
         res.status(200).json({
      message: "Login Successful",
    });
});
    }

   
  } catch (err) {
    console.error("Error finding User:", err);
    res.status(500).json({
      errors: ["An error occured."],
      oldInputs: {
        email: email,
        password: password,
        loginType: loginType,
      },
    });
  }
};
exports.postSignUp = [
  check("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Enter your name")
    .matches(/^[A-Za-z]+$/)
    .withMessage("Name should contain letters"),
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail()
    .custom(async (value) => {
      const existingAdmin = await AdminUser.findOne({
        email: value,
      });
      if (existingAdmin) {
        throw new Error("Email/Username is already in use");
      }
    }),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one Uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one Lowercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/)
    .withMessage("Password must contain at least one special character")
    .trim(),
  (req, res, next) => {
    const { name, email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map((err) => err.msg),
        oldInputs: {
          name: name,
          email: email,
          password: password,
        },
      });
    }
    bcrypt.hash(password, 12).then((hashedPassword) => {
      const adminUser = new AdminUser({
        name: name,
        email: email,
        password: hashedPassword,
      });

      adminUser
        .save()
        .then((adminUser) => {
          req.session.regenerate((err) => {
            if (err) {
              console.error("Session save error : ", err);
              return res.status(500).json({
                errors: ["An error occured."],
              });
            }

            req.session.isLoggedIn = true;
            req.session.AdminUser = adminUser;
            req.session.loginType = "teacher";
        

            res.status(200).json({
              message: "SignUp Successful",
            });
          });
        
        })
        .catch((err) => {
          console.error("Error Signing In:", err);
          res.status(500).json({
            errors: ["An error Occured:"],
            oldInputs: {
              name: name,
              email: email,
              password: password,
            },
          });
        });
    });
  },
];
exports.postDeleteAccount = async (req, res, next) => {
  try {
    if (!req.session?.AdminUser?._id) {
      return res.status(401).json({
        errors: ["Unauthorized : Please log in first"],
      });
    }
    const { password } = req.body;
    const adminUser = await AdminUser.findOne({
      email: req.session.AdminUser.email,
    });

    if (!adminUser) {
      return res.status(404).json({
        errors: ["User not found."],
      });
    }
    const isMatch = await bcrypt.compare(password, adminUser.password);

    if (!isMatch) {
      return res.status(401).json({
        errors: ["Wrong Credentials."],
      });
    }

    // image logic

    await AdminUser.findByIdAndDelete(req.session.AdminUser._id);

    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session : ", err);
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({
        success: true,
        message: "Account Deleted Successfully.",
      });
    });
  } catch (err) {
    console.error("Error deleting accound : ", err);
    res.status(500).json({
      errors: ["Failed to delete account."],
    });
  }
};

exports.postLogOut = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
      return res.status(500).json({
        success: false,
        errors: ["An error occurred while logging out."],
      });
    }

    res.clearCookie("connect.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  });
};
