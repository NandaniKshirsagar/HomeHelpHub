require("dotenv").config();
const express = require("express");
const { createUser,checkUserByEmail,uploadclientImage} = require("../controllers/usercontroller"); // Correct import
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define route for creating users
router.post("/create-user", upload.single('profilePhoto'), createUser);
router.post("/get-user", checkUserByEmail);
router.post('/upload-client-profile', upload.single('image'), uploadclientImage);

module.exports = router;
