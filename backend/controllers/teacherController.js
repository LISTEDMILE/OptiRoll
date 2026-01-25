const AdminUser = require("../models/adminModel");
const StudentUser = require("../models/studentModel");
const bcrypt = require("bcryptjs");
const tmp = require("tmp");
require("dotenv").config();
const nodemailer = require("nodemailer");
const { getFaceEncoding } = require("../face/faceEncod");
const fs = require("fs");

const path = require("path");

// helper
const formatDate = (d) => d.toISOString().split("T")[0];

// split logic for cross-midnight sessions
function handleAttendanceSplit(user, startTime, endTime) {
  let current = new Date(startTime);

  while (formatDate(current) !== formatDate(endTime)) {
    const midnight = new Date(current);
    midnight.setHours(23, 59, 59, 999);

    const onlineTime = midnight - current;
    const existing = user.attendence.data.find(
      (atten) => formatDate(new Date(atten.Date)) === formatDate(current),
    );

    if (existing) {
      existing.timings.push({
        start: current.toISOString(),
        end: midnight.toISOString(),
      });
      existing.onlineTime += onlineTime;
    } else {
      user.attendence.data.push({
        Date: current.toISOString(),
        timings: [
          {
            start: current.toISOString(),
            end: midnight.toISOString(),
          },
        ],
        onlineTime,
      });
    }

    // move to next day
    current = new Date(midnight);
    current.setHours(0, 0, 0, 0);
    current.setDate(current.getDate() + 1);
  }

  // final chunk
  const onlineTime = endTime - current;
  const existing = user.attendence.data.find(
    (atten) => formatDate(new Date(atten.Date)) === formatDate(endTime),
  );

  if (existing) {
    existing.timings.push({
      start: current.toISOString(),
      end: endTime.toISOString(),
    });
    existing.onlineTime += onlineTime;
  } else {
    user.attendence.data.push({
      Date: endTime.toISOString(),
      timings: [
        {
          start: current.toISOString(),
          end: endTime.toISOString(),
        },
      ],
      onlineTime,
    });
  }
}

// ====================
// Cosine distance function
// ====================
function cosineDistance(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 1;
  let dot = 0,
    magA = 0,
    magB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }
  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);
  if (magA === 0 || magB === 0) return 1;
  const cosineSim = dot / (magA * magB);
  return 1 - cosineSim; // 0 = perfect match
}

// ====================
// Main attendance function
// ====================
exports.teacherMarkAttendence = async (req, res, next) => {
  try {
    if (
      !req.session ||
      req.session.isLoggedIn !== true ||
      req.session.loginType !== "teacher" ||
      !req.session.AdminUser
    ) {
      return res.status(401).json({ errors: ["Unauthorized Access "] });
    }

    const adminUserStudents = await AdminUser.findById(
      req.session.AdminUser._id,
    ).select("students");
    if (!adminUserStudents)
      return res.status(404).json({ errors: ["Admin not found"] });

    const adminUserStatus = await AdminUser.findById(
      req.session.AdminUser._id,
    ).select("attendence.whatNext");
    if (adminUserStatus.attendence.whatNext !== "end")
      return res.status(201).json({ errors: ["Attendence not marking"] });

    if (!req.file || !req.file.buffer)
      return res.status(400).json({ errors: ["No face image uploaded"] });

    let uploadedEmbedding;

    if (!req.file) {
      return res.status(400).json({
        errors: ["No image uploaded"],
      });
    }

    const file = req.file;

    const tmpFile = tmp.fileSync({
      postfix: path.extname(file.originalname),
    });

    try {
      fs.writeFileSync(tmpFile.name, file.buffer);

      uploadedEmbedding = await getFaceEncoding(tmpFile.name);
    } catch (err) {
      console.error("Face encoding error:", err);

      return res.status(400).json({
        errors: ["Could not detect a valid face in the uploaded image"],
      });
    } finally {
      tmpFile.removeCallback();
    }

    // ====================
    // Matching logic
    // ====================
    let bestMatch = null;
    let minDistance = Infinity;

    // stricter threshold for unknown faces
    const THRESHOLD = 0.35;

    for (const studentId of adminUserStudents.students) {
      const student = await StudentUser.findById(studentId);
      if (!student.faceEncoding || student.faceEncoding.length === 0) continue;

      // only one embedding per student now
      const emb = student.faceEncoding[0];
      const distance = cosineDistance(uploadedEmbedding, emb);

      if (distance < THRESHOLD && distance < minDistance) {
        minDistance = distance;
        bestMatch = student;
      }
    }

    // if no student passes the threshold, reject
    if (!bestMatch) {
      return res.status(404).json({ errors: ["Student not recognized"] });
    }

    const studentUser = bestMatch;
    const testDate = new Date();

    // ====================
    // Existing attendance logic (start/end)
    // ====================
    if (studentUser.attendence.whatNext == "start") {
      studentUser.attendence.startTime = testDate.toISOString();
      studentUser.attendence.whatNext = "end";
      studentUser.markModified("attendence.data");
      await studentUser.save();
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465, // SSL
        secure: true, // true for 465
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL,
        to: studentUser.email,
        subject: "Punch-In/Out (OptiRoll)",
        html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #4CAF50; text-align: center;">Attendance Marked Successfully ✅</h2>
      <p>Hi <strong>${studentUser.name}</strong>,</p>
      <p>Your attendance has been recorded with the following details:</p>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Date & Time:</strong> ${testDate.toLocaleString()}</li>
        <li><strong>Status:</strong> "Start"</li>
      </ul>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${
          process.env.FRONTEND_URL
        }/student/studentDashboard" target="_blank" 
           style="text-decoration: none; background-color: #4CAF50; color: white; padding: 12px 25px; border-radius: 5px; font-weight: bold;">
          View Dashboard
        </a>
      </p>
      <p style="font-size: 0.9em; color: #666;">This is an automated message from OptiRoll. Please do not reply to this email.</p>
    </div>
  `,
      });
      return res.status(200).json({
        student: { name: studentUser.name, email: studentUser.email },
        markedAt: testDate,
        status: "start",
      });
    } else if (studentUser.attendence.whatNext == "end") {
      const startTime = new Date(studentUser.attendence.startTime);
      const endTime = testDate;

      if (formatDate(startTime) === formatDate(endTime)) {
        const existing = studentUser.attendence.data.find(
          (atten) => formatDate(new Date(atten.Date)) === formatDate(startTime),
        );

        if (existing) {
          const onlineTime = endTime - startTime + Number(existing.onlineTime);
          existing.Date = startTime.toISOString();
          existing.timings = [
            ...existing.timings,
            { start: startTime.toISOString(), end: endTime.toISOString() },
          ];
          existing.onlineTime = onlineTime;
        } else {
          const onlineTime = endTime - startTime;
          studentUser.attendence.data.push({
            Date: startTime.toISOString(),
            timings: [
              { start: startTime.toISOString(), end: endTime.toISOString() },
            ],
            onlineTime,
          });
        }
      } else {
        handleAttendanceSplit(studentUser, startTime, endTime);
      }

      studentUser.attendence.whatNext = "start";
      studentUser.markModified("attendence.data");
      await studentUser.save();
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465, // SSL
        secure: true, // true for 465
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL,
        to: studentUser.email,
        subject: "Punch-In/Out (OptiRoll)",
        html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #4CAF50; text-align: center;">Attendance Marked Successfully ✅</h2>
      <p>Hi <strong>${studentUser.name}</strong>,</p>
      <p>Your attendance has been recorded with the following details:</p>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Date & Time:</strong> ${testDate.toLocaleString()}</li>
        <li><strong>Status:</strong> "End"</li>
      </ul>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${
          process.env.FRONTEND_URL
        }/student/studentDashboard" target="_blank" 
           style="text-decoration: none; background-color: #4CAF50; color: white; padding: 12px 25px; border-radius: 5px; font-weight: bold;">
          View Dashboard
        </a>
      </p>
      <p style="font-size: 0.9em; color: #666;">This is an automated message from OptiRoll. Please do not reply to this email.</p>
    </div>
  `,
      });
      return res.status(200).json({
        student: { name: studentUser.name, email: studentUser.email },
        markedAt: testDate,
        status: "end",
      });
    }
  } catch (err) {
    console.error("Error marking attendence:", err);
    return res.status(500).json({ errors: ["Error Marking Attendence"] });
  }
};

exports.startMarking = async (req, res, next) => {
  try {
    if (
      !req.session ||
      req.session.isLoggedIn !== true ||
      req.session.loginType !== "teacher"
    ) {
      return res.status(401).json({
        errors: ["Unauthorized Access "],
      });
    }

    const { password } = req.body;

    const pass = await AdminUser.findById(req.session.AdminUser._id).select(
      "password",
    );
    const isMatch = await bcrypt.compare(password, pass.password);

    if (!isMatch) {
      return res.status(401).json({
        errors: ["Wrong Credentials."],
      });
    }

    const teacherUser = await AdminUser.findById(
      req.session.AdminUser._id,
    ).select("attendence");
    const testDate = new Date();

    if (teacherUser.attendence.whatNext == "start") {
      teacherUser.attendence.startTime = testDate.toISOString();
      teacherUser.attendence.whatNext = "end";
      teacherUser.markModified("attendence.data");
      await teacherUser.save();
      return res.status(200).json({
        time: testDate,
        status: "start",
      });
    } else if (teacherUser.attendence.whatNext == "end") {
      await StudentUser.updateMany(
        { "attendence.whatNext": "end" },
        { $set: { "attendence.whatNext": "start" } },
      );

      const startTime = new Date(teacherUser.attendence.startTime);
      const endTime = testDate;

      if (formatDate(startTime) === formatDate(endTime)) {
        // same day logic
        const existing = teacherUser.attendence.data.find(
          (atten) => formatDate(new Date(atten.Date)) === formatDate(startTime),
        );

        if (existing) {
          const onlineTime = endTime - startTime + Number(existing.onlineTime);
          existing.Date = startTime.toISOString();
          existing.timings = [
            ...existing.timings,
            {
              start: startTime.toISOString(),
              end: endTime.toISOString(),
            },
          ];
          existing.onlineTime = onlineTime;
        } else {
          const onlineTime = endTime - startTime;
          teacherUser.attendence.data.push({
            Date: startTime.toISOString(),
            timings: [
              {
                start: startTime.toISOString(),
                end: endTime.toISOString(),
              },
            ],
            onlineTime,
          });
        }
      } else {
        // cross-midnight fix
        handleAttendanceSplit(teacherUser, startTime, endTime);
      }

      teacherUser.attendence.whatNext = "start";
      teacherUser.markModified("attendence.data");
      await teacherUser.save();
      return res.status(200).json({
        time: testDate,
        status: "end",
      });
    }
  } catch (err) {
    console.error("Error Starting/Ending Attendence : ", err);
    return res.status(500).json({
      errors: ["Error Starting/Ending Attendence"],
    });
  }
};

exports.statusMarking = async (req, res, next) => {
  try {
    if (
      !req.session ||
      req.session.isLoggedIn !== true ||
      req.session.loginType !== "teacher"
    ) {
      return res.status(401).json({
        errors: ["Unauthorized Access "],
      });
    }
    const statusMarking = await AdminUser.findById(
      req.session.AdminUser._id,
    ).select("attendence.whatNext");
    return res.status(200).json({
      whatNext: statusMarking,
    });
  } catch (err) {
    console.error("Error Operating Attendence : ", err);
    return res.status(500).json({
      errors: ["Error Operating Attendence"],
    });
  }
};
