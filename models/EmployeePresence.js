const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const employeePresenceSchema = new mongoose.Schema(
  {
    employeeId:{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    employeeName: String,
    employeeCode: String,
    date: String,
    present: { type: Boolean, default: 0 },
    workHours: { type: String, default: 0 },
  },
  { timestamps: true }
);

var EmployeePresence = mongoose.model("EmployeePresence", employeePresenceSchema);
module.exports = EmployeePresence;
