const StudentUser = require("../models/studentModel");
const AdminUser = require("../models/adminModel");
const cloudinary = require("../utils/cloudinary");
const { check, validationResult } = require("express-validator");

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

exports.editStudentDashboard =
  [
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
  
    check("parentEmail")
      .optional()
      .isEmail()
      .withMessage("Invalid parent email"),
  
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
        if (!Array.isArray(value)) throw new Error("Achievements must be an array");
        return true;
      }),
  
    check("bio")
      .optional()
      .isLength({ max: 300 })
      .withMessage("Bio must be under 300 characters"),
  
  
  async (req, res, next) => {
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

      const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
      }
      
      const student = await StudentUser.findById(req.session.StudentUser._id);

      // Update basic fields
            const fields = [
              "name", "rollNumber", "dateOfBirth", "gender", "course", "year", "section",
              "parentName", "parentPhone", "parentEmail", "phone", "bio"
            ];
            fields.forEach((f) => { if (req.body[f] !== undefined) student[f] = req.body[f]; });
      
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
                name: req.body.emergencyContact.name || student.emergencyContact?.name,
                relation: req.body.emergencyContact.relation || student.emergencyContact?.relation,
                phone: req.body.emergencyContact.phone || student.emergencyContact?.phone,
              };
            }
      
            // Arrays
            ["hobbies", "skills", "achievements"].forEach((arr) => {
              if (req.body[arr]) student[arr] = req.body[arr];
            });
      
            // Profile picture (multer)
            if (req.files && req.files.profilePicture && req.files.profilePicture.length > 0) {
              const file = req.files.profilePicture[0];
      
              // Delete old picture
              if (student.profilePicture) {
                const publicId = student.profilePicture.split("/").pop().split(".")[0];
                try { await cloudinary.uploader.destroy(`Optiroll/profilePictures/${publicId}`); } 
                catch (err) { console.log("Error deleting old profile picture:", err.message); }
              }
      
              const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                  { folder: "Optiroll/profilePictures" },
                  (error, result) => error ? reject(error) : resolve(result)
                );
                stream.end(file.buffer);
              });
              student.profilePicture = uploadResult.secure_url;
            }
      
            await student.save();
            return res.status(200).json({ message: "Student updated successfully", student });
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
}];

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
