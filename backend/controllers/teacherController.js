const AdminUser = require("../models/adminModel");
const StudentUser = require("../models/studentModel");
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
