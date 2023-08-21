const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Employee = require("../models/Employee");
const jwt = require("jsonwebtoken");
let jwtKey = process.env.JWTKEY;
const bcrypt = require('bcryptjs');

module.exports.LogIn =catchAsyncErrors( async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ email: req.body.email });
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        msg: 'User not found',
      });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, employee.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        msg: 'Invalid password',
      });
    }

    // If the email and password are correct, store user data in the session
    req.session.user = {
      _id: employee._id,
      isAdmin: employee.isAdmin,
      userName: employee.userName,
      image:employee.image
    };

    // const token = jwt.sign(tokenPayload, jwtKey, { expiresIn: '1h' });

    res.status(200).json({
      success: true,
      msg: 'Login successful',
      // token,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      msg: 'Internal server error',
    });
  }
});

module.exports.Logout = catchAsyncErrors(async(req,res,next)=>{
   // Destroy the session and clear the session cookie
   req.session.destroy((err) => {
    if (err) {
      console.error('Logout failed:', err);
      res.status(500).json({
        success: false,
        msg: 'Logout failed',
      });
    } else {
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.status(200).json({
        success: true,
        msg: 'Logout successful',
      });
    }
  });
})


// module.exports.LogIn = catchAsyncErrors(async (req, res, next) => {
//   var arr = [
//     {
//       name: "s1",
//       subject: [
//         {
//           subject: "math",
//           total: 83,
//         },
//         {
//           subject: "sci",
//           total: 87,
//         },
//         {
//           subject: "eng",
//           total: 85,
//         },
//       ],
//     },
//     {
//       name: "s2",
//       subject: [
//         {
//           subject: "math",
//           total: 75,
//         },
//         {
//           subject: "sci",
//           total: 69,
//         },
//         {
//           subject: "eng",
//           total: 87,
//         },
//       ],
//     },
//     {
//       name: "s3",
//       subject: [
//         {
//           subject: "math",
//           total: 89,
//         },
//         {
//           subject: "sci",
//           total: 92,
//         },
//         {
//           subject: "eng",
//           total: 92,
//         },
//       ],
//     },
//   ];
//   try {
//     mathMarks = [];
//     sciMarks = [];
//     engMarks = [];
//     totalMarks = [];
//     mathTotal = arr.forEach((student) => {
//       student.subject.forEach((subject) => {
//         totalMarks.push(subject.total);
//         if (subject.subject == "math") {
//           mathMarks.push(subject.total);
//         }
//         if (subject.subject == "sci") {
//           sciMarks.push(subject.total);
//         }
//         if (subject.subject == "eng") {
//           engMarks.push(subject.total);
//         }
//       });
//     });
//     console.log("mathMarks+++++", mathMarks.reduce(getSum, 0));
//     console.log("sciMarks+++++", sciMarks.reduce(getSum, 0));
//     console.log("engMarks+++++", engMarks.reduce(getSum, 0));
//     console.log("totalMarks+++++", totalMarks.reduce(getSum, 0));

//     function getSum(total, num) {
//       return total + Math.round(num);
//     }
//   } catch (error) {}
// });
