require("dotenv").config();
const express = require("express");
const {createServiceProvider,checkUserByEmail,uploadProfileImage} = require("../controllers/usercontroller"); // Correct import
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/createServiceProvider", createServiceProvider);
router.post("/get-user", checkUserByEmail);
router.post("/upload-img", upload.single('image'), uploadProfileImage); // New Route
module.exports = router;
