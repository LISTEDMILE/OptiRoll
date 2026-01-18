const { check, validationResult } = require("express-validator");
const AdminUser = require("../models/adminModel");
const StudentUser = require("../models/studentModel");
const tmp = require("tmp");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../utils/cloudinary");
require("dotenv").config();
const { getFaceEncoding } = require("../face/faceEncod");

exports.addStudentPost = [
  // First middleware → Parse JSON strings before validation
  (req, res, next) => {
    try {
      // Parse address if it comes as string
      if (req.body.address && typeof req.body.address === "string") {
        req.body.address = JSON.parse(req.body.address);
      }

      // Parse array fields
      ["hobbies", "skills", "achievements"].forEach((field) => {
        if (req.body[field] && typeof req.body[field] === "string") {
          req.body[field] = JSON.parse(req.body[field]);
        }
      });
    } catch (err) {
      console.error("JSON parse error:", err.message);
      return res.status(400).json({
        errors: ["Invalid JSON in request body"],
      });
    }
    next();
  },

  // ===== VALIDATIONS =====
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

  check("rollNumber")
    .trim()
    .notEmpty()
    .withMessage("Roll number is required")
    .matches(/^[A-Za-z0-9-]+$/)
    .withMessage("Invalid roll number format"),

  check("dateOfBirth")
    .notEmpty()
    .withMessage("Date of birth is required")
    .isISO8601()
    .withMessage("Invalid date format"),

  check("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["Male", "Female", "Other"])
    .withMessage("Invalid gender"),

  check("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone()
    .withMessage("Invalid phone number"),

  // Address validations (after parsing)
  check("address.street")
    .trim()
    .notEmpty()
    .withMessage("Street is required")
    .isLength({ min: 2 })
    .withMessage("Street must be at least 2 characters"),

  check("address.city")
    .trim()
    .notEmpty()
    .withMessage("City is required")
    .isLength({ min: 2 })
    .withMessage("City must be at least 2 characters"),

  check("address.state")
    .trim()
    .notEmpty()
    .withMessage("State is required")
    .isLength({ min: 2 })
    .withMessage("State must be at least 2 characters"),

  check("address.zip")
    .trim()
    .notEmpty()
    .withMessage("ZIP is required")
    .isPostalCode("any")
    .withMessage("Invalid ZIP code"),

  check("address.country")
    .trim()
    .notEmpty()
    .withMessage("Country is required")
    .isLength({ min: 2 })
    .withMessage("Country must be at least 2 characters"),

  check("course").trim().notEmpty().withMessage("Course is required"),

  check("year")
    .notEmpty()
    .withMessage("Year is required")
    .isInt()
    .withMessage("Year must be integer"),

  check("section").trim().notEmpty().withMessage("Section is required"),

  check("parentName")
    .optional()
    .matches(/^[A-Za-z ]*$/)
    .withMessage("Parent name should contain letters"),

  check("parentPhone")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid parent phone"),

  check("parentEmail").optional().isEmail().withMessage("Invalid parent email"),

  check("emergencyContact.name")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Emergency contact name must be a string"),

  check("emergencyContact.relation")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Emergency contact relation must be a string"),

  check("emergencyContact.phone")
    .optional({ checkFalsy: true })
    .isMobilePhone()
    .withMessage("Invalid emergency contact phone number"),

  check("hobbies")
    .optional()
    .custom((value) => {
      if (!Array.isArray(value)) throw new Error("Hobbies must be an array");
      return true;
    }),

  check("skills")
    .optional()
    .custom((value) => {
      if (!Array.isArray(value)) throw new Error("Skills must be an array");
      return true;
    }),

  check("achievements")
    .optional()
    .custom((value) => {
      if (!Array.isArray(value))
        throw new Error("Achievements must be an array");
      return true;
    }),

  check("bio")
    .optional()
    .isLength({ max: 300 })
    .withMessage("Bio must be under 300 characters"),

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
        Math.floor(Math.random() * 10),
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
              },
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

exports.editStudentDashboard = [
  (req, res, next) => {
    try {
      // Parse address if it comes as string
      if (req.body.address && typeof req.body.address === "string") {
        req.body.address = JSON.parse(req.body.address);
      }

      // Normalize array fields directly
      ["hobbies", "skills", "achievements"].forEach((field) => {
        if (req.body[field]) {
          try {
            let val = req.body[field];

            // If client sent string like '["a","b"]', parse it
            if (typeof val === "string") {
              try {
                val = JSON.parse(val);
              } catch {
                // not JSON, treat it as single string value
                val = [val];
              }
            }

            // Ensure array
            if (!Array.isArray(val)) val = [val];
            req.body[field] = val;
          } catch (err) {
            console.error(`Error normalizing ${field}:`, err.message);
            return res.status(400).json({
              errors: [`Invalid value for ${field}`],
            });
          }
        }
      });
    } catch (err) {
      console.error("JSON parse error:", err.message);
      return res.status(400).json({
        errors: ["Invalid JSON in request body"],
      });
    }
    next();
  },

  // ===== VALIDATIONS =====
  check("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Enter your name")
    .matches(/^[A-Za-z ]+$/)
    .withMessage("Name should contain letters"),

  check("rollNumber")
    .trim()
    .notEmpty()
    .withMessage("Roll number is required")
    .matches(/^[A-Za-z0-9-]+$/)
    .withMessage("Invalid roll number format"),

  check("dateOfBirth")
    .notEmpty()
    .withMessage("Date of birth is required")
    .isISO8601()
    .withMessage("Invalid date format"),

  check("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["Male", "Female", "Other"])
    .withMessage("Invalid gender"),

  check("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone()
    .withMessage("Invalid phone number"),

  // Address validations (after parsing)
  check("address.street")
    .trim()
    .notEmpty()
    .withMessage("Street is required")
    .isLength({ min: 2 })
    .withMessage("Street must be at least 2 characters"),

  check("address.city")
    .trim()
    .notEmpty()
    .withMessage("City is required")
    .isLength({ min: 2 })
    .withMessage("City must be at least 2 characters"),

  check("address.state")
    .trim()
    .notEmpty()
    .withMessage("State is required")
    .isLength({ min: 2 })
    .withMessage("State must be at least 2 characters"),

  check("address.zip")
    .trim()
    .notEmpty()
    .withMessage("ZIP is required")
    .isPostalCode("any")
    .withMessage("Invalid ZIP code"),

  check("address.country")
    .trim()
    .notEmpty()
    .withMessage("Country is required")
    .isLength({ min: 2 })
    .withMessage("Country must be at least 2 characters"),

  check("course").trim().notEmpty().withMessage("Course is required"),

  check("year")
    .notEmpty()
    .withMessage("Year is required")
    .isInt()
    .withMessage("Year must be integer"),

  check("section").trim().notEmpty().withMessage("Section is required"),

  check("parentName")
    .optional()
    .matches(/^[A-Za-z ]*$/)
    .withMessage("Parent name should contain letters"),

  check("parentPhone")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid parent phone"),

  check("parentEmail").optional().isEmail().withMessage("Invalid parent email"),

  check("emergencyContact.name")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Emergency contact name must be a string"),

  check("emergencyContact.relation")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Emergency contact relation must be a string"),

  check("emergencyContact.phone")
    .optional({ checkFalsy: true })
    .isMobilePhone()
    .withMessage("Invalid emergency contact phone number"),

  check("hobbies")
    .optional()
    .custom((value) => {
      if (!Array.isArray(value)) throw new Error("Hobbies must be an array");
      return true;
    }),

  check("skills")
    .optional()
    .custom((value) => {
      if (!Array.isArray(value)) throw new Error("Skills must be an array");
      return true;
    }),

  check("achievements")
    .optional()
    .custom((value) => {
      if (!Array.isArray(value))
        throw new Error("Achievements must be an array");
      return true;
    }),

  check("bio")
    .optional()
    .isLength({ max: 300 })
    .withMessage("Bio must be under 300 characters"),

  async (req, res) => {
    try {
      if (
        !req.session ||
        req.session.loginType !== "admin" ||
        req.session.isLoggedIn !== true
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

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array().map((e) => e.msg) });
      }

      const student = await StudentUser.findById(sid);
      if (!student)
        return res.status(404).json({ errors: ["Student not found"] });

      // Update basic fields
      const fields = [
        "name",
        "rollNumber",
        "dateOfBirth",
        "gender",
        "course",
        "year",
        "section",
        "parentName",
        "parentPhone",
        "parentEmail",
        "phone",
        "bio",
      ];
      fields.forEach((f) => {
        if (req.body[f] !== undefined) student[f] = req.body[f];
      });

      // Address
      if (req.body.address) {
        student.address = {
          street: req.body.address.street || student.address?.street,
          city: req.body.address.city || student.address?.city,
          state: req.body.address.state || student.address?.state,
          zip: req.body.address.zip || student.address?.zip,
          country: req.body.address.country || student.address?.country,
        };
      }

      // Emergency contact
      if (req.body.emergencyContact) {
        student.emergencyContact = {
          name:
            req.body.emergencyContact.name || student.emergencyContact?.name,
          relation:
            req.body.emergencyContact.relation ||
            student.emergencyContact?.relation,
          phone:
            req.body.emergencyContact.phone || student.emergencyContact?.phone,
        };
      }

      ["hobbies", "skills", "achievements"].forEach((arr) => {
        if (req.body[arr]) {
          student[arr] = Array.isArray(req.body[arr])
            ? req.body[arr]
            : [req.body[arr]];
        }
      });

      // Profile picture (multer)
      if (
        req.files &&
        req.files.profilePicture &&
        req.files.profilePicture.length > 0
      ) {
        const file = req.files.profilePicture[0];

        // Delete old picture
        if (student.profilePicture) {
          const publicId = student.profilePicture
            .split("/")
            .pop()
            .split(".")[0];
          try {
            await cloudinary.uploader.destroy(
              `Optiroll/profilePictures/${publicId}`,
            );
          } catch (err) {
            console.log("Error deleting old profile picture:", err.message);
          }
        }

        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "Optiroll/profilePictures" },
            (error, result) => (error ? reject(error) : resolve(result)),
          );
          stream.end(file.buffer);
        });
        student.profilePicture = uploadResult.secure_url;
      }

      await student.save();
      return res
        .status(200)
        .json({ message: "Student updated successfully", student });
    } catch (err) {
      console.error("Error editing dashboard:", err);
      return res.status(500).json({ errors: ["Error editing dashboard"] });
    }
  },
];

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
      const studentProfileUrl =
        await StudentUser.findById(sid).select("profilePicture");
      if (studentProfileUrl && studentProfileUrl.profilePicture) {
        const publicId = studentProfileUrl.profilePicture
          .split("/")
          .pop()
          .split(".")[0];
        try {
          await cloudinary.uploader.destroy(
            `Optiroll/profilePictures/${publicId}`,
          );
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
