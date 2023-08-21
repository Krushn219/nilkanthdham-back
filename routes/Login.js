const express = require("express");
const { LogIn, Logout } = require("../controller/LoginController");
const { checkTokenValidity } = require("../jwt/jsonwebtoken");
const router = express.Router();

router.route("/").post(LogIn);
router.route("/logout").post(Logout);
// Route to check the validity of the JWT token
router.post("/check-token-validity", checkTokenValidity, (req, res) => {
    res.status(200).json({
      success: true,
      msg: "Token is valid",
    });
  });

module.exports = router;
