const EmployeePresence = require("../models/EmployeePresence");
const ErrorHandler = require("../utils/errorhandler");
const ApiFeatures = require("../utils/apifeatures");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Employee = require("../models/Employee");

module.exports.createEmployeePresence = catchAsyncErrors(
  async (req, res, next) => {
    const { presenceData } = req.body;

    try {
      const createdRecords = [];

      for (var data of presenceData) {

        const isExisted = await EmployeePresence.findOne({
          employeeCode: data.employeeCode,
          date: data.date,
        });
        if (isExisted) {
          // continue; // Skip if record already exists
          // Update the existing record
          isExisted.employeeName = data.employeeName;
          isExisted.employeeCode = data.employeeCode;
          isExisted.present = data.present;
          isExisted.workHours = data.workHours;

          await isExisted.save(); // Save the updated record
          createdRecords.push(isExisted); // Add it to the created records array
        } else {
          // Create a new record if it doesn't exist
          const employeePresence = await EmployeePresence.create({
            employeeID: data.id,
            employeeName: data.employeeName,
            employeeCode: data.employeeCode,
            date: data.date,
            present: data.present,
            workHours: data.workHours,
          });

          createdRecords.push(employeePresence);
        }
      }

      return res.status(201).json({
        success: true,
        createdRecords,
      });
    } catch (error) {
      console.error("Error creating employee presence records:", error);
      return res.status(500).json({
        success: false,
        error: "Error creating employee presence records",
      });
    }
  }
);

module.exports.getAllEmployeePresence = catchAsyncErrors(
  async (req, res, next) => {
    try {
      const resultPerPage = Number(req.query.limit);

      let totalEmployeePresence = await EmployeePresence.countDocuments();
      const sort = {};

      if (req.query.sortBy && req.query.groupBy) {
        sort[req.query.sortBy] = req.query.groupBy === "desc" ? -1 : 1;
      }

      const apiFeature = new ApiFeatures(
        EmployeePresence.find().sort(sort),
        req.query
      )
        .filter()
        .search()
        .pagination(resultPerPage);
      let employeePresence = await apiFeature.query;
      let filteredEmployeePresenceCount = employeePresence.length;

      return res.status(200).json({
        success: true,
        totalEmployeePresence: totalEmployeePresence,
        filteredEmployeePresence: filteredEmployeePresenceCount,
        page: req.query.page,
        limit: resultPerPage,
        employeePresence,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 404));
    }
  }
);

module.exports.getAllEmployeePresenceByDate = catchAsyncErrors(
  async (req, res, next) => {
    try {
      const resultPerPage = Number(req.query.limit);

      let totalEmployeePresence = await EmployeePresence.countDocuments();
      const sort = {};

      if (req.query.sortBy && req.query.groupBy) {
        sort[req.query.sortBy] = req.query.groupBy === "desc" ? -1 : 1;
      }

      const apiFeature = new ApiFeatures(
        EmployeePresence.find().sort(sort),
        req.query
      )
        .filter()
        .search()
        .pagination(resultPerPage);
      let employeePresence = await apiFeature.query;
      let filteredEmployeePresenceCount = employeePresence.length;

      return res.status(200).json({
        success: true,
        totalEmployeePresence: totalEmployeePresence,
        filteredEmployeePresence: filteredEmployeePresenceCount,
        page: req.query.page,
        limit: resultPerPage,
        employeePresence,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 404));
    }
  }
);

module.exports.getSingleEmployeePresence = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    try {
      const employeePresence = await EmployeePresence.findById(id);
      if (!employeePresence) {
        return res.status(404).json({
          success: false,
          msg: "EmployeePresence not found",
        });
        return next(new ErrorHandler("EmployeePresence not found", 404));
      }
      return res.status(200).json({
        success: true,
        employeePresence,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 404));
    }
  }
);

module.exports.updateEmployeePresence = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;

    const employeePresence = await EmployeePresence.findById(id);
    if (!employeePresence) {
      return res.status(404).json({
        success: false,
        msg: "EmployeePresence not found",
      });
      return next(new ErrorHandler("EmployeePresence not found", 404));
    }
    try {
      const updateEmployeePresence = await EmployeePresence.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );

      return res.status(200).json({
        success: true,
        updateEmployeePresence,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 404));
    }
  }
);

module.exports.deleteEmployeePresence = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    const employeePresence = await EmployeePresence.findById(id);
    if (!employeePresence) {
      return res.status(404).json({
        success: false,
        msg: "EmployeePresence not found",
      });
      return next(new ErrorHandler("EmployeePresence not found", 404));
    }
    try {
      const data = await EmployeePresence.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        msg: "Deleted Successfully..",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 404));
    }
  }
);
