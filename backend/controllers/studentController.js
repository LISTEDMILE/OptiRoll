const StudentUser = require("../models/studentModel");

exports.studentStudentDashboard = async (req, res, next) => {
  try {
    if (
      !req.session ||
      req.session.isLoggedIn !== true ||
      req.session.loginType !== "student" || !req.session.StudentUser
    ) {
      return res.status(401).json({
        errors: ["Unauthorized Access"],
      });
    }

      

    const studentUser = await StudentUser.findById(req.session.StudentUser._id);
    if (!studentUser) {
      return res.status(401).json({
        errors: ["Student not found"],
      });
    }

    return res.status(200).json({
      student: studentUser,
    });
  } catch (err) {
    console.error("Error fetching dashboard : ", err);
    return res.status(500).json({
      errors: ["Error fetching dashboard"],
    });
  }
};

exports.editStudentDashboard = async (req, res, next) => {
  console.log("ldkjf");
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

    const { sid } = req.params;

    const adminUser = await AdminUser.findById(req.session.AdminUser._id);
    if (!adminUser.students.includes(sid)) {
      return res.status(401).json({
        errors: ["Unauthorized Access"],
      });
    }

    try {
      const student = await StudentUser.findById(sid);

      // more fields to add...
      const { name } = req.body;
      student.name = name;

      await student.save();
      return res.status(200).json({
        message: "Student Updated successfully",
      });
    } catch (err) {
      console.error("Error fetching dashboard : ", err);
      return res.status(500).json({
        errors: ["Error Editting dashboard"],
      });
    }
  } catch (err) {
    console.error("Error fetching dashboard : ", err);
    return res.status(500).json({
      errors: ["Error fetching dashboard"],
    });
  }
};