const { check, validationResult } = require("express-validator");
const AdminUser = require("../models/adminModel");
const StudentUser = require("../models/studentModel");

exports.addStudentPost = [
  check("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Enter your name")
    .matches(/^[A-Za-z ]+$/)
    .withMessage("Name should contain letters"),
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail()
    .custom(async (value) => {
      const existingStudent = await StudentUser.findOne({
        email: value,
      });
      if (existingStudent) {
        throw new Error("Email/Username is already in use");
      }
    }),
  async (req, res, next) => {
    const { name, email } = req.body;
    try {
      if (
        !req.session ||
        req.session.isLoggedIn !== true ||
        req.session.loginType !== "admin"
      ) {
        return res.status(401).json({
          errors: ["Unauthorized Access"],
        });
      }
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array().map((err) => err.msg),
          oldInputs: {
            name: name,
            email: email,
          },
        });
      }

      const adminUser = await AdminUser.findById(req.session.AdminUser._id);
      if (!adminUser) {
        return res.status(404).json({
          errors: ["User not found."],
          oldInputs: {
            name: name,
            email: email,
          },
        });
      }

      let pass = "";
      for (let i = 0; i < 10; i++) {
        pass += Math.floor(Math.random() * 10);
      }

      const studentUser = new StudentUser({
        name: name,
        email: email,
        password: pass,
        admin: req.session.AdminUser._id,
      });

      adminUser.students = [...adminUser.students, studentUser._id];

      await adminUser.save();
      await studentUser.save();

      return res.status(201).json({
        message: "Student Added Successfully.",
      });
    } catch (err) {
      console.error("Error adding student : ", err);
      return res.status(500).json({
        errors: ["Error Adding student"],
        oldInputs: {
          name: name,
          email: email,
        },
      });
    }
  },
];

exports.adminStudentList = async (req, res, next) => {
  try {
    if (
      !req.session ||
      req.session.isLoggedIn !== true ||
      req.session.loginType !== "admin"
    ) {
      return res.status(401).json({
        errors: ["Unauthorized Access"],
      });
    }

    const adminUser = await AdminUser.findById(req.session.AdminUser._id);
    if (!adminUser) {
      return res.status(404).json({
        errors: ["User not found"],
      });
    } else {
      const studentsList = (await adminUser.populate("students")).students;
      return res.status(200).json({
        studentsList: studentsList,
      });
    }
  } catch (err) {
    console.error("Error fetching students . : ", err);
    res.status(500).json({
      errors: ["Error fetching Students."],
    });
  }
};

exports.adminStudentDashboard =async (req, res, next) => {
    try {
        if (!req.session || req.session.isLoggedIn !== true || req.session.loginType !== "admin") {
            return res.status(401).json({
                errors:["Unauthorized Access"]
            })
        }

        const { sid } = req.params;
        
        const adminUser = await AdminUser.findById(req.session.AdminUser._id);
        if (!adminUser.students.includes(sid)) {
            return res.status(401).json({
                errors:["Unauthorized Access"]
            })
        }

        const student =await StudentUser.findById(sid);
        
        return res.status(200).json({
            student:student
        })

    } catch (err) {
        console.error("Error fetching dashboard : ", err);
        return res.status(500).json({
            errors:["Error fetching dashboard"]
        })
    }
}
