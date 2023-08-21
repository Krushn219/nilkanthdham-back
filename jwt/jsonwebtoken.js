const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.admin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

// Middleware to check the validity of a JWT token
const checkTokenValidity = (req, res, next) => {
  // Extract the token from the request headers
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      success: false,
      msg: "No token provided",
    });
  }

  try {
    // Verify the token using your JWT secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // You can also add additional checks here, such as checking if the user exists in the database

    // Token is valid, you can proceed with the request
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({
      success: false,
      msg: "Token is invalid",
    });
  }
};

module.exports = {verifyToken ,verifyTokenAndAdmin, checkTokenValidity};