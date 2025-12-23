const express = require("express");
const { sendOTP, googleauthController } = require("../controllers/authController");

const router = express.Router();

router.post("/send-otp", sendOTP);
router.get("/google", googleauthController.getGoogleAuth);
router.get("/google/callback", googleauthController.getGoogleCallback);
router.get("/profile", googleauthController.getProfile);
router.get("/logout", googleauthController.logout);

module.exports = router;
