const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// const employeePresenceSchema = new mongoose.Schema(
//   {
//     employeeId:{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
//     employeeName: String,
//     employeeCode: String,
//     date: String,
//     present: { type: Boolean, default: 0 },
//     workHours: { type: String, default: 0 },
//   },
//   { timestamps: true }
// );

const employeePresenceSchema = new mongoose.Schema(
  {
    employeeId:{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    userName: String,
    employeeCode: String,
    date: String,
    image: {
      type: String,
      unique: false,
      default:"https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
    },
    present: { type: Boolean, default: 0 },
    workHours: { type: String, default: 0 },
    dailyWages: { type: String, default: 0 },
  },
  { timestamps: true }
);

var EmployeePresence = mongoose.model("EmployeePresence", employeePresenceSchema);
module.exports = EmployeePresence;
