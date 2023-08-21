const express = require("express");
const {
  createEmployee,
  getAllEmployee,
  getSingleEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeDataForPastDate
} = require("../controller/EmployeeController");
const router = express.Router();
const upload = require("../services/multer")

router.route("/create").post(upload.single("image"),createEmployee);

router.route("/all").get(getAllEmployee);

router.route("/:id").get(getSingleEmployee);

router.route("/edit/:id").put(upload.single("image"),updateEmployee);
// router.route("/edit/:id").put(updateEmployee);

router.route("/:id").delete(deleteEmployee);

// All Employee Data from past
router.route("/pastDateData/:date").get(getEmployeeDataForPastDate);


module.exports = router;
