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
      console.error("Student Not found ");
      return res.status(404).json({
        errors: ["Student Not Found"],
      });
    }
    const testDate = new Date();
    const attendDate = testDate.toISOString().split("T")[0];

    if (studentUser.attendence.whatNext == "start") {
      studentUser.attendence.startTime = testDate;
      studentUser.attendence.whatNext = "end";
    } else if (studentUser.attendence.whatNext == "end") {
      const existing = studentUser.attendence.data.find(
        (atten) =>
          atten.Date.toString().split("T")[0] ==
          studentUser.attendence.startTime.toString().split("T")[0]
      );

      if (existing) {
        const onlineTime =
          testDate -
          studentUser.attendence.startTime +
          studentUser.attendence.onlineTime;
        existing.Date = studentUser.attendence.startTime;
        existing.timings = [
          ...existing.timings,
          {
            start: studentUser.attendence.startTime,
            end: testDate,
          },
        ];

        existing.onlineTime = onlineTime;
      } else {
        const onlineTime = testDate - studentUser.attendence.startTime;
        studentUser.attendence.data.push({
          Date: studentUser.attendence.startTime,
          timings: [
            {
              start: studentUser.attendence.startTime,
              end: testDate,
            },
          ],
          onlineTime: onlineTime,
        });
      }
      studentUser.attendence.whatNext = "start";
    }

    studentUser.markModified("attendence.data");
    await studentUser.save();
  } catch (err) {
    console.error("Error marking attendence : ", err);
    return res.status(500).json({
      errors: ["Error Marking Attendence"],
    });
  }
};
