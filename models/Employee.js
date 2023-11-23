const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Joi = require("joi");
const boolean = require("joi/lib/types/boolean");

const employeeSchema = new mongoose.Schema(
  {
    email: { type: String, trim: true, default: "" },
    password: { type: String },
    image: {
      type: String,
      unique: false,
      default:
        "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg",
    },
    dateOfJoining: { type: String, required: true },
    userName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    permanentAddress: { type: String },
    contactNo: { type: String, required: true },
    gender: {
      type: String,
      trim: true,
      required: true,
      enum: ["Male", "Female"],
    },
    dateOfBirth: { type: String, required: true },
    adharNumber: { type: String, required: true },
    panCardNo: { type: String, required: true },
    bankname: { type: String, required: true },
    accountno: { type: String, required: true },
    ifsc: { type: String, required: true },
    emergencyContactNo: { type: String },
    employeeCode: { type: Number, unique: true },

    status: { type: String, default: "inActive", enum: ["active", "inActive"] },

    avatar: {
      type: String,
    },
    cloudinary_id: {
      type: String,
    },

    isAdmin: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // presentAddress: { type: String },
    // employeeCode: { type: String, required: true },
    // role: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    // position: [{ type: mongoose.Schema.Types.ObjectId, ref: "Position" }],
    // department: [{ type: mongoose.Schema.Types.ObjectId, ref: "Department" }],
    // salary: [{ type: mongoose.Schema.Types.ObjectId, ref: "Salary" }],
    // education: [{ type: mongoose.Schema.Types.ObjectId, ref: "Education" }],
    // familyInfo: [{ type: mongoose.Schema.Types.ObjectId, ref: "FamilyInfo" }],
    // bloodGroup: { type: String },
  },
  { timestamps: true }
);

// employeeSchema.plugin(mongooseSequence, { inc_field: "employeeCode" });

employeeSchema.pre("save", async function (next) {
  if (!this.employeeCode) {
    const Employee = mongoose.model("Employee");

    try {

      const highestEmployee = await Employee.findOne().sort({ employeeCode: -1 }).exec();
      this.employeeCode = highestEmployee ? highestEmployee.employeeCode + 1 : 1;
    } catch (error) {
      console.error("Error finding highest employee:", error);
    }
  }

  next();
});


// employeeSchema.pre("save", async function (next) {
//   if (!this.employeeCode) {
//     const Employee = mongoose.model("Employee");
//     const highestEmployee = await Employee.findOne({}).sort({ employeeCode: -1 });
//     console.log("highestEmployee++++",highestEmployee)
//     this.employeeCode = highestEmployee ? highestEmployee.employeeCode + 1 : 1;
//   }
//   next();
// });

// employeeSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }

//   this.password =  bcrypt.hash(this.password, 10);
// });

// JWT TOKEN
employeeSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password
// employeeSchema.methods.comparePassword = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

// Generating Password Reset Token
employeeSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hashing and adding resetPasswordToken to adminSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

var Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
