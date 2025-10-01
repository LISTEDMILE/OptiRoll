const { check, validationResult } = require("express-validator");
const AdminUser = require("../models/adminModel");
const StudentUser = require("../models/studentModel");
const { spawn } = require("child_process");
const tmp = require("tmp");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../utils/cloudinary");
require("dotenv").config();

function getFaceEncoding(imagePath) {
  return new Promise((resolve, reject) => {
    const py = spawn(
      process.env.NODE_ENV === "production" ? "./venv/bin/python" : "py",
      ["./face/encode_face.py", imagePath]
    );

    let data = "";
    py.stdout.on("data", (chunk) => (data += chunk.toString()));
    py.stderr.on("data", (err) =>
      console.error("Python error:", err.toString())
    );

    py.on("close", () => {
      try {
        const result = JSON.parse(data);
        if (result.error) reject(result.error);
        else resolve(result.embedding);
      } catch (e) {
        reject(e);
      }
    });
  });
}

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
      const existingStudent = await StudentUser.findOne({ email: value });
      if (existingStudent) {
        throw new Error("Email/Username is already in use");
      }
    }),

  async (req, res, next) => {
    const {
      name,
      email,
      rollNumber,
      dateOfBirth,
      gender,
      phone,
      address,
      course,
      year,
      section,
      parentName,
      parentPhone,
      parentEmail,
      emergencyContact,
      hobbies,
      bio,
      skills,
      achievements,
    } = req.body;

    try {
      if (
        !req.session ||
        req.session.isLoggedIn !== true ||
        req.session.loginType !== "admin"
      ) {
        return res.status(401).json({ errors: ["Unauthorized Access"] });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array().map((err) => err.msg),
          oldInputs: {
            name,
            email,
            rollNumber,
            dateOfBirth,
            gender,
            phone,
            address,
            course,
            year,
            section,
            parentName,
            parentPhone,
            parentEmail,
            emergencyContact,
            hobbies,
            bio,
            skills,
            achievements,
          },
        });
      }

      const adminUser = await AdminUser.findById(req.session.AdminUser._id);
      if (!adminUser) {
        return res.status(404).json({
          errors: ["User not found."],
          oldInputs: {
            name,
            email,
            rollNumber,
            dateOfBirth,
            gender,
            phone,
            address,
            course,
            year,
            section,
            parentName,
            parentPhone,
            parentEmail,
            emergencyContact,
            hobbies,
            bio,
            skills,
            achievements,
          },
        });
      }

      // generate random 10-digit password
      let pass = Array.from({ length: 10 }, () =>
        Math.floor(Math.random() * 10)
      ).join("");

      // Handle profile picture upload via Cloudinary
      let profilePicUrl = null;
      if (
        req.files &&
        req.files.profilePicture &&
        req.files.profilePicture[0]
      ) {
        const file = req.files.profilePicture[0];
        try {
          await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "Optiroll/profilePictures" },
              (error, result) => {
                if (error) reject(error);
                else {
                  profilePicUrl = result.secure_url;
                  resolve(result);
                }
              }
            );
            stream.end(file.buffer);
          });
        } catch (err) {
          console.error("Cloudinary upload error:", err);
          return res.status(500).json({
            errors: ["Failed to upload profile picture"],
            oldInputs: {
              name,
              email,
              rollNumber,
              dateOfBirth,
              gender,
              phone,
              address,
              course,
              year,
              section,
              parentName,
              parentPhone,
              parentEmail,
              emergencyContact,
              hobbies,
              bio,
              skills,
              achievements,
            },
          });
        }
      }

      // Handle webcam images → face embeddings
      let encodings = [];
      if (req.files && req.files.images && req.files.images.length > 0) {
        for (const file of req.files.images) {
          const tmpFile = tmp.fileSync({
            postfix: path.extname(file.originalname),
          });
          fs.writeFileSync(tmpFile.name, file.buffer);

          try {
            const encoding = await getFaceEncoding(tmpFile.name);
            encodings.push(encoding);
          } catch (err) {
            console.error("Face encoding error:", err);
            return res.status(400).json({
              errors: [
                "Could not detect a valid face in one of the uploaded images",
              ],
              oldInputs: {
                name,
                email,
                rollNumber,
                dateOfBirth,
                gender,
                phone,
                address,
                course,
                year,
                section,
                parentName,
                parentPhone,
                parentEmail,
                emergencyContact,
                hobbies,
                bio,
                skills,
                achievements,
              },
            });
          } finally {
            tmpFile.removeCallback();
          }
        }

        // Average embeddings if multiple
        if (encodings.length > 1) {
          const avgEncoding = encodings[0].map((_, i) => {
            return (
              encodings.reduce((sum, enc) => sum + enc[i], 0) / encodings.length
            );
          });
          encodings = [avgEncoding];
        }
      }

      // Create student
      const studentUser = new StudentUser({
        name,
        email,
        password: pass,
        rollNumber,
        dateOfBirth,
        gender,
        phone,
        address,
        profilePicture: profilePicUrl,
        course,
        year,
        section,
        parentName,
        parentPhone,
        parentEmail,
        emergencyContact,
        hobbies,
        bio,
        skills,
        achievements,
        admin: req.session.AdminUser._id,
        faceEncoding: encodings,
      });

      adminUser.students.push(studentUser._id);

      await adminUser.save();
      await studentUser.save();

      return res.status(201).json({
        message: "Student Added Successfully.",
      });
    } catch (err) {
      console.error("Error adding student:", err);
      return res.status(500).json({
        errors: ["Error Adding student"],
        oldInputs: {
          name,
          email,
          rollNumber,
          dateOfBirth,
          gender,
          phone,
          address,
          course,
          year,
          section,
          parentName,
          parentPhone,
          parentEmail,
          emergencyContact,
          hobbies,
          bio,
          skills,
          achievements,
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

exports.adminStudentDashboard = async (req, res, next) => {
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

    const student = await StudentUser.findById(sid);

    return res.status(200).json({
      student: student,
    });
  } catch (err) {
    console.error("Error fetching dashboard : ", err);
    return res.status(500).json({
      errors: ["Error fetching dashboard"],
    });
  }
};

exports.editStudentDashboard = async (req, res) => {
  try {
    const { sid } = req.params;
    const student = await StudentUser.findById(sid);

    if (!student) {
      return res.status(404).json({ errors: ["Student not found"] });
    }

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
    if (req.body["emergencyContact[name]"] || req.body["emergencyContact[phone]"]) {
      student.emergencyContact = {
        name: req.body["emergencyContact[name]"] || student.emergencyContact?.name,
        relation: req.body["emergencyContact[relation]"] || student.emergencyContact?.relation,
        phone: req.body["emergencyContact[phone]"] || student.emergencyContact?.phone,
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
    if (req.files && req.files.profilePicture && req.files.profilePicture.length > 0) {
  const file = req.files.profilePicture[0];

      // Delete old one if exists
      if (student.profilePicture) {
        const publicId = student.profilePicture.split("/").pop().split(".")[0];
        try {
          await cloudinary.uploader.destroy(`Optiroll/profilePictures/${publicId}`);
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
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const { sid } = req.params;
    if (
      !req.session ||
      req.session.loginType !== "admin" ||
      req.session.isLoggedIn !== true
    ) {
      return res.status(401).json({
        errors: ["Unauthorized Access"],
      });
    }

    const adminUser = await AdminUser.findById(req.session.AdminUser._id);
    if (!adminUser.students.includes(sid)) {
      return res.status(401).json({
        errors: ["Unauthorized Access"],
      });
    }

    try {

      const studentProfileUrl = await StudentUser.findById(sid).select("profilePicture");
      if (studentProfileUrl && studentProfileUrl.profilePicture) {
        
        const publicId = studentProfileUrl.profilePicture.split("/").pop().split(".")[0];
        try {
          await cloudinary.uploader.destroy(`Optiroll/profilePictures/${publicId}`);
        } catch (err) {
          console.log("Error deleting old profile picture:", err.message);
        }
      }
        
      
      await StudentUser.findByIdAndDelete(sid);

      return res.status(200).json({
        message: "Student Deleted successfully",
      });
    } catch (err) {
      console.error("Error Deleting Student : ", err);
      return res.status(500).json({
        errors: ["Error Deleting Student"],
      });
    }
  } catch (err) {
    console.error("Error deleting Student : ", err);
    return res.status(500).json({
      errors: ["Error Deleting Student"],
    });
  }
};

exports.adminStudentAttencence = async (req, res, next) => {
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
      if (!student) {
        return res.status(404).json({
          errors: ["Error finding student"],
        });
      }

      return res.status(200).json({
        attendence: student.attendence,
        adminAttendence: adminUser.attendence,
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

exports.adminAdminAttencence = async (req, res, next) => {
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

    const sid = req.session.AdminUser._id;

    try {
      const admin = await AdminUser.findById(sid);
      if (!admin) {
        return res.status(404).json({
          errors: ["Error finding admin"],
        });
      }

      return res.status(200).json({
        attendence: admin.attendence,
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
