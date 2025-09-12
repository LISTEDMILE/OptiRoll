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


   

    try {
      const studentUser = await StudentUser.findById(req.session.StudentUser._id);

      // more fields to add...
      const { name } = req.body;
      studentUser.name = name;

      await studentUser.save();
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


exports.studentStudentAttencence = async (req, res, next) => {
  try {
    if (!req.session || req.session.isLoggedIn !== true || req.session.loginType !== "student") {
      return res.status(401).json({
        errors: ["Unauthorized Access"]
      })
    }

    const  sid  = req.session.StudentUser._id;

    try {

      const student = await StudentUser.findById(sid);
      if (!student) {
        return res.status(404).json({
          errors:["Error finding student"]
        })
      }

      return res.status(200).json({
        attendence: student.attendence
      })
      
    } catch (err) {
      console.error("Error fetching data", err);
      return res.status(500).json({
        errors:["Error fetching data"]
      })
    }


  }
  catch (err) {
    console.error("Error fetching attendence", err);
    return res.status(500).json({
      errors:["Server Error"]
    })
  }
}
