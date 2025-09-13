const AdminUser = require("../models/adminModel");
const StudentUser = require("../models/studentModel");
const bcrypt = require("bcryptjs");

exports.teacherMarkAttendence = async (req, res, next) => {
  try {
    if (
      !req.session ||
      req.session.isLoggedIn !== true ||
      req.session.loginType !== "teacher" ||
      !req.session.AdminUser
    ) {
      console.log(req.session);
      return res.status(401).json({
        errors: ["Unauthorized Access "],
      });
    }
    const studentEmail = req.body.email;

    const adminUserStudents = await AdminUser.findById(
      req.session.AdminUser._id
    ).select("students");

    if (!adminUserStudents) {
      return res.status(404).json({ errors: ["Admin not found"] });
    }

    const adminUserStatus = await AdminUser.findById(req.session.AdminUser._id).select("attendence.whatNext");

    if (adminUserStatus.attendence.whatNext !== "end") {
      return res.status(201).json({
        errors:["Attendence not marking"]
      })
    }
    
    const studentUser = await StudentUser.findOne({
      _id: { $in: adminUserStudents.students },
      email: studentEmail,
    });

    if (!studentUser) {
      return res.status(404).json({
        errors: ["Student Not Found"],
      });
    }
    const testDate = new Date();

    if (studentUser.attendence.whatNext == "start") {
      studentUser.attendence.startTime = testDate.toISOString();
      studentUser.attendence.whatNext = "end";
      studentUser.markModified("attendence.data");
    await studentUser.save();
    return res.status(200).json({
      student: {
        name: studentUser.name,
        email:studentUser.email
      },
      markedAt: testDate,
      status:"start"
    })
    } else if (studentUser.attendence.whatNext == "end") {
      const existing = studentUser.attendence.data.find(
        (atten) =>
          atten.Date.split("T")[0] ==
          studentUser.attendence.startTime.split("T")[0]
      );

      if (existing) {
        const onlineTime =
          testDate -
          new Date(studentUser.attendence.startTime) +
          Number(existing.onlineTime);
        existing.Date = studentUser.attendence.startTime;
        existing.timings = [
          ...existing.timings,
          {
            start: studentUser.attendence.startTime,
            end: testDate.toISOString(),
          },
        ];

        existing.onlineTime = onlineTime;
      } else {
        const onlineTime = testDate - new Date(studentUser.attendence.startTime);
        studentUser.attendence.data.push({
          Date: studentUser.attendence.startTime,
          timings: [
            {
              start: studentUser.attendence.startTime,
              end: testDate.toISOString(),
            },
          ],
          onlineTime: onlineTime,
        });
      }
      studentUser.attendence.whatNext = "start";
      studentUser.markModified("attendence.data");
    await studentUser.save();
    return res.status(200).json({
       student: {
        name: studentUser.name,
        email:studentUser.email
      },
      markedAt: testDate,
      status:"end"
    })
    }

    
  } catch (err) {
    console.error("Error marking attendence : ", err);
    return res.status(500).json({
      errors: ["Error Marking Attendence"],
    });
  }
};

exports.startMarking = async (req, res, next) => {
    try {
    if (
      !req.session ||
      req.session.isLoggedIn !== true ||
      req.session.loginType !== "teacher"
    ) {
      console.log(req.session);
      return res.status(401).json({
        errors: ["Unauthorized Access "],
      });
      }

      const { password } = req.body;
      
      const pass = await AdminUser.findById(req.session.AdminUser._id).select("password");
      const isMatch = await bcrypt.compare(password, pass.password);
      
          if (!isMatch) {
            return res.status(401).json({
              errors: ["Wrong Credentials."],
            });
          }

      const teacherUser = await AdminUser.findById(req.session.AdminUser._id).select("attendence");
    const testDate = new Date();

    if (teacherUser.attendence.whatNext == "start") {
      teacherUser.attendence.startTime = testDate.toISOString();
      teacherUser.attendence.whatNext = "end";
      teacherUser.markModified("attendence.data");
    await teacherUser.save();
    return res.status(200).json({
      time: testDate,
      status:"start"
    })
    } else if (teacherUser.attendence.whatNext == "end") {

    await StudentUser.updateMany(
  { "attendence.whatNext": "end" },
  { $set: { "attendence.whatNext": "start" } }
      ); 
      
      const existing = teacherUser.attendence.data.find(
        (atten) =>
          atten.Date.split("T")[0] ==
          teacherUser.attendence.startTime.split("T")[0]
      );

      if (existing) {
        const onlineTime =
          testDate -
          new Date(teacherUser.attendence.startTime) +
          Number(existing.onlineTime);
        existing.Date = teacherUser.attendence.startTime;
        existing.timings = [
          ...existing.timings,
          {
            start: teacherUser.attendence.startTime,
            end: testDate.toISOString(),
          },
        ];

        existing.onlineTime = onlineTime;
      } else {
        const onlineTime = testDate - new Date(teacherUser.attendence.startTime);
        teacherUser.attendence.data.push({
          Date: teacherUser.attendence.startTime,
          timings: [
            {
              start: teacherUser.attendence.startTime,
              end: testDate.toISOString(),
            },
          ],
          onlineTime: onlineTime,
        });
      }
      teacherUser.attendence.whatNext = "start";
      teacherUser.markModified("attendence.data");
    await teacherUser.save();
    return res.status(200).json({
      time: testDate,
      status:"end"
    })
    }

    
  } catch (err) {
    console.error("Error Starting/Ending Attendence : ", err);
    return res.status(500).json({
      errors: ["Error Starting/Ending Attendence"],
    });
  }
}

exports.statusMarking = async (req, res, next) => {
   try {
    if (
      !req.session ||
      req.session.isLoggedIn !== true ||
      req.session.loginType !== "teacher"
    ) {
      console.log(req.session);
      return res.status(401).json({
        errors: ["Unauthorized Access "],
      });
    }
      const statusMarking = await AdminUser.findById(req.session.AdminUser._id).select("attendence.whatNext");
     return res.status(200).json({
     whatNext : statusMarking
   })
    
  } catch (err) {
    console.error("Error Operating Attendence : ", err);
    return res.status(500).json({
      errors: ["Error Operating Attendence"],
    });
  }
}