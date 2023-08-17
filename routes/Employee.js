const express = require("express");
const {
  createEmployee,
  getAllEmployee,
  getSingleEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controller/EmployeeController");
const router = express.Router();
const {upload} = require("../services/multer")

router.route("/create").post(upload.single("image"),createEmployee);

router.route("/all").get(getAllEmployee);

router.route("/:id").get(getSingleEmployee);

router.route("/edit/:id").put(upload.single("image"),updateEmployee);

router.route("/:id").delete(deleteEmployee);

module.exports = router;
