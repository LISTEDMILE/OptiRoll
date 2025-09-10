const AdminUser = require("../models/adminModel");
const StudentUser = require("../models/studentModel");
exports.teacherMarkAttendence = async (req, res, next) => {
    try {

        if (!req.session || req.session.isLoggedIn !== true || req.session.loginType !== "teacher" || !req.session.AdminUser) {
            console.log(req.session)
            return res.status(401).json({
                errors:["Unauthorized Access "]
            })
        }
        const studentEmail = req.body.email;
        
        const adminUserStudents = await AdminUser.findById(req.session.AdminUser._id).select("students");

        if(!adminUserStudents){
            return res.status(404).json({errors:["Admin not found"]})
        }

        const studentUser = await StudentUser.findOne({
            _id: { $in: adminUserStudents.students },
            email: studentEmail
        });
        
        if (!studentUser) {
            console.error("Student Not found ");
            return res.status(404).json({
                errors:["Student Not Found"]
            })
        }

        const attendDate = new Date().toISOString().split("T")[0];

        if (studentUser.attendence.some(atten => atten.Date == attendDate)) {
            
        }
        else {
            studentUser.attendence.push({ Date: attendDate });
        }
       await  studentUser.save();

        
    } catch (err) {
        console.error("Error marking attendence : ", err);
        return res.status(500).json({
            errors:["Error Marking Attendence"]
        })
    }
}