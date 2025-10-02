const StudentUser = require("../models/studentModel");
const AdminUser = require("../models/adminModel");
const cloudinary = require("../utils/cloudinary");

exports.studentStudentDashboard = async (req, res, next) => {
  try {
    if (
      !req.session ||
      req.session.isLoggedIn !== true ||
      req.session.loginType !== "student" ||
      !req.session.StudentUser
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
      req.session.loginType !== "student" ||
      !req.session.StudentUser
    ) {
      return res.status(401).json({
        errors: ["Unauthorized Access"],
      });
    }

    try {
      const student = await StudentUser.findById(req.session.StudentUser._id);

      // Basic fields
      const {
        name,
        rollNumber,
        dateOfBirth,
        gender,
        course,
        year,
        section,
        parentName,
        parentPhone,
        parentEmail,
        phone,
        bio,
      } = req.body;

      if (name) student.name = name;
      if (rollNumber) student.rollNumber = rollNumber;
      if (dateOfBirth) student.dateOfBirth = dateOfBirth;
      if (gender) student.gender = gender;
      if (course) student.course = course;
      if (year) student.year = year;
      if (section) student.section = section;
      if (parentName) student.parentName = parentName;
      if (parentPhone) student.parentPhone = parentPhone;
      if (parentEmail) student.parentEmail = parentEmail;
      if (phone) student.phone = phone;
      if (bio) student.bio = bio;

      // Address (nested object)
      if (req.body["address[street]"] || req.body["address.city"]) {
        student.address = {
          street: req.body["address[street]"] || student.address?.street,
          city: req.body["address[city]"] || student.address?.city,
          state: req.body["address[state]"] || student.address?.state,
          zip: req.body["address[zip]"] || student.address?.zip,
          country: req.body["address[country]"] || student.address?.country,
        };
      }

      // Emergency Contact (nested object)
      if (
        req.body["emergencyContact[name]"] ||
        req.body["emergencyContact[phone]"]
      ) {
        student.emergencyContact = {
          name:
            req.body["emergencyContact[name]"] ||
            student.emergencyContact?.name,
          relation:
            req.body["emergencyContact[relation]"] ||
            student.emergencyContact?.relation,
          phone:
            req.body["emergencyContact[phone]"] ||
            student.emergencyContact?.phone,
        };
      }

      // Arrays (convert comma-separated values to array if string passed)
      if (req.body.hobbies) {
        student.hobbies = Array.isArray(req.body.hobbies)
          ? req.body.hobbies
          : req.body.hobbies.split(",").map((h) => h.trim());
      }

      if (req.body.skills) {
        student.skills = Array.isArray(req.body.skills)
          ? req.body.skills
          : req.body.skills.split(",").map((s) => s.trim());
      }

      if (req.body.achievements) {
        student.achievements = Array.isArray(req.body.achievements)
          ? req.body.achievements
          : req.body.achievements.split(",").map((a) => a.trim());
      }

      // Handle profile picture (if uploaded via multer)
      if (
        req.files &&
        req.files.profilePicture &&
        req.files.profilePicture.length > 0
      ) {
        const file = req.files.profilePicture[0];

        // Delete old one if exists
        if (student.profilePicture) {
          const publicId = student.profilePicture
            .split("/")
            .pop()
            .split(".")[0];
          try {
            await cloudinary.uploader.destroy(
              `Optiroll/profilePictures/${publicId}`
            );
          } catch (err) {
            console.log("Error deleting old profile picture:", err.message);
          }
        }

        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "Optiroll/profilePictures" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });

        student.profilePicture = uploadResult.secure_url;
      }

      await student.save();

      return res.status(200).json({
        message: "Student updated successfully",
        student,
      });
    } catch (err) {
      console.error("Error editing dashboard:", err);
      return res.status(500).json({
        errors: ["Error editing dashboard"],
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      errors: ["Error Editing Dashboard"],
    });
  }
};

exports.studentStudentAttencence = async (req, res, next) => {
  try {
    if (
      !req.session ||
      req.session.isLoggedIn !== true ||
      req.session.loginType !== "student"
    ) {
      return res.status(401).json({
        errors: ["Unauthorized Access"],
      });
    }

    const sid = req.session.StudentUser._id;

    try {
      const student = await StudentUser.findById(sid);
      if (!student) {
        return res.status(404).json({
          errors: ["Error finding student"],
        });
      }
      const adminAttendence = await AdminUser.findById(student.admin).select(
        "attendence"
      );
      if (!adminAttendence) {
        return res.status(404).json({
          errors: ["Your admin not found"],
        });
      }

      return res.status(200).json({
        attendence: student.attendence,
        adminAttendence: adminAttendence.attendence,
      });
    } catch (err) {
      console.error("Error fetching data", err);
      return res.status(500).json({
        errors: ["Error fetching data"],
      });
    }
  } catch (err) {
    console.error("Error fetching attendence", err);
    return res.status(500).json({
      errors: ["Server Error"],
    });
  }
};
