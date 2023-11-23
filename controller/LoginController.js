const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Employee = require("../models/Employee");
const jwt = require("jsonwebtoken");
let jwtKey = process.env.JWT_SECRET;
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

    // If the email and password are correct, store user data in the local storage
    const tokenPayload = {
      _id: employee._id,
      isAdmin: employee.isAdmin,
      userName: employee.userName,
      image: employee.image,
    };

    const token = jwt.sign(tokenPayload, jwtKey, { expiresIn: '1h' });

    res.status(200).json({
      success: true,
      msg: 'Login successful',
      token,
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
