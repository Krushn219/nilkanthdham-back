const Employee = require("../models/Employee");
const ErrorHandler = require("../utils/errorhandler");
const ApiFeatures = require("../utils/apifeatures");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const EmployeePresence = require("../models/EmployeePresence");
const uploadToCloudinary = require("../services/uploadCloudinary");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_Secret,
});

module.exports.createEmployee = catchAsyncErrors(async (req, res, next) => {
  try {
    // return if user already exist
    const isExisted = await Employee.findOne({ email: req.body.email });
    if (isExisted) {
      return res.status(400).json({
        success: false,
        msg: "User Already Existed with this Email...",
      });
    }
    // create new user
    const {
      userName,
      email,
      password,
      gender,
      DOB,
      dateOfJoining,
      status,
      adharNumber,
      contactNo,
      emergencyContactNo,
      employeeCode,
      bloodGroup,
      panCardNo,
      permanentAddress,
      presentAddress,
    } = req.body;

    // image provided
    if (req.file) {
      var locaFilePath = req.file.path;

      // upload image in cloudinory
      // var result = await uploadToCloudinary(locaFilePath);

      // Upload image to cloudinary using upload_stream
    const uploadResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "main", // You can adjust the folder where the image is uploaded
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      // Create a readable stream from the buffer and pipe it to uploadStream
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null);

      bufferStream.pipe(uploadStream);
    });

      req.body.image = uploadStream.url;
      req.body.avatar = uploadStream.result.secure_url;
      req.body.cloudinary_id = uploadStream.result.public_id;

      const employee = await Employee.create(req.body);

      if (!employee) {
        return res.status(404).json({
          success: false,
          msg: "Can't Create Employee..",
        });
      }

      return res.status(201).json({
        success: true,
        employee,
      });
    } else {

      const employee = await Employee.create(req.body);

      if (!employee) {
        return res.status(404).json({
          success: false,
          msg: "Can't Create Employee..",
        });
      }

      return res.status(201).json({
        success: true,
        employee,
      });
    }
  } catch (error) {
    console.log("error+++", error);
    return next(new ErrorHandler(error.message, 404));
  }
});

module.exports.getAllEmployee = catchAsyncErrors(async (req, res, next) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const formattedToday = `${year}-${month}-${day}`;
  try {
    const resultPerPage = Number(req.query.limit);

    let totalEmployee = await Employee.countDocuments();
    const sort = {};

    if (req.query.sortBy && req.query.groupBy) {
      sort[req.query.sortBy] = req.query.groupBy === "desc" ? -1 : 1;
    }

    const apiFeature = new ApiFeatures(Employee.find().sort(sort), req.query)
      .filter()
      .search()
      .pagination(resultPerPage);
    let employee = await apiFeature.query;
    let filteredEmployeeCount = employee.length;

    return res.status(200).json({
      success: true,
      totalEmployee: totalEmployee,
      filteredEmployee: filteredEmployeeCount,
      page: req.query.page,
      limit: resultPerPage,
      employee,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 404));
  }
});

module.exports.getSingleEmployee = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  try {
    const employee = await Employee.findById(id).select("-password");
    if (!employee) {
      return res.status(404).json({
        success: false,
        msg: "Employee not found",
      });
      return next(new ErrorHandler("Employee not found", 404));
    }
    return res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 404));
  }
});

module.exports.updateEmployee = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  if (req.body.password) {
    return res.status(400).json({
      success: false,
      msg: "Cannot edit password...",
    });
  }

  const employee = await Employee.findById(id);

  if (!employee) {
    return res.status(404).json({
      success: false,
      msg: "Employee not found",
    });
  }
  if (req.file) {
    console.log("With image");

    if (employee.cloudinary_id) {
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(employee.cloudinary_id);
    }

    // // Upload image to cloudinary
    // var locaFilePath = req.file.path;
    // console.log("local+++",req.file.buffer)

    // var result = await uploadToCloudinary(locaFilePath);

    // Upload image to cloudinary using upload_stream
    const uploadResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "main", // You can adjust the folder where the image is uploaded
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      // Create a readable stream from the buffer and pipe it to uploadStream
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null);

      bufferStream.pipe(uploadStream);
    });

    const data = {
      userName: req.body.userName || employee.userName,
      lastName: req.body.lastName || employee.lastName,
      email: req.body.email || employee.email,
      image: uploadResponse.url,
      gender: req.body.gender || employee.gender,
      dateOfBirth: req.body.dateOfBirth || employee.dateOfBirth,
      dateOfJoining: req.body.dateOfJoining || employee.dateOfJoining,
      status: req.body.status || employee.status,
      adharNumber: req.body.adharNumber || employee.adharNumber,
      contactNo: req.body.contactNo || employee.contactNo,
      emergencyContactNo:
        req.body.emergencyContactNo || employee.emergencyContactNo,
      employeeCode: req.body.employeeCode || employee.employeeCode,
      bloodGroup: req.body.bloodGroup || employee.bloodGroup,
      panCardNo: req.body.panCardNo || employee.panCardNo,
      permanentAddress: req.body.permanentAddress || employee.permanentAddress,
      presentAddress: req.body.presentAddress || employee.presentAddress,
      avatar: uploadResponse.secure_url || employee.avatar,
      cloudinary_id: uploadResponse.public_id || employee.cloudinary_id,
    };

    try {
      const updateEmployee = await Employee.findByIdAndUpdate(id, data, {
        new: true,
      });

      return res.status(200).json({
        success: true,
        updateEmployee,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 404));
    }
  } else {
    console.log("Without image");
    const data = {
      userName: req.body.userName || employee.userName,
      lastName: req.body.lastName || employee.lastName,
      email: req.body.email || employee.email,
      image: employee.image,
      gender: req.body.gender || employee.gender,
      dateOfBirth: req.body.dateOfBirth || employee.dateOfBirth,
      dateOfJoining: req.body.dateOfJoining || employee.dateOfJoining,
      status: req.body.status || employee.status,
      adharNumber: req.body.adharNumber || employee.adharNumber,
      contactNo: req.body.contactNo || employee.contactNo,
      emergencyContactNo:
        req.body.emergencyContactNo || employee.emergencyContactNo,
      employeeCode: req.body.employeeCode || employee.employeeCode,
      bloodGroup: req.body.bloodGroup || employee.bloodGroup,
      panCardNo: req.body.panCardNo || employee.panCardNo,
      permanentAddress: req.body.permanentAddress || employee.permanentAddress,
      presentAddress: req.body.presentAddress || employee.presentAddress,
      avatar: employee.avatar,
      cloudinary_id: employee.cloudinary_id,
    };

    try {
      const updateEmployee = await Employee.findByIdAndUpdate(id, data, {
        new: true,
      });

      return res.status(200).json({
        success: true,
        updateEmployee,
      });
    } catch (error) {
      console.log("err++++", error);
      return next(new ErrorHandler(error.message, 404));
    }
  }
});

module.exports.deleteEmployee = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const employee = await Employee.findById(id);
  if (!employee) {
    return res.status(404).json({
      success: false,
      msg: "Employee not found",
    });
  }
  try {
    const data = await Employee.findByIdAndDelete(id);

    // Delete image from cloudinary
    await cloudinary.uploader.destroy(employee.cloudinary_id);
    return res.status(200).json({
      success: true,
      msg: "Deleted Successfully..",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 404));
  }
});
