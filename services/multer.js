const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Set up multer storage
const storage = multer.memoryStorage(); // Store files in memory as buffers

// Create a multer instance with the configured storage
const upload = multer({ storage });

module.exports = upload;