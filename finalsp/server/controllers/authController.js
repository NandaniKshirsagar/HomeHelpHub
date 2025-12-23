require("dotenv").config();
const nodemailer = require("nodemailer");
const passport = require("../config/passportConfig");

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

// Send OTP Function
async function sendOTP(req, res) {
  const { email } = req.body;
  const otpCode = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

  try {
    const info = await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "HomeHelpHub OTP Verification",
      text: `Your OTP for verification is: ${otpCode}`,
    });

    console.log("OTP sent: %s", info.messageId);
    return res.status(200).json({ messageId: info.messageId, otp: otpCode });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Error sending OTP." });
  }
}

// Google Authentication Controller (Without JWT)
const googleauthController = {
  getGoogleAuth: passport.authenticate("google", { scope: ["profile", "email"] }),

  getGoogleCallback: [
    passport.authenticate("google", { failureRedirect: "/auth-main" }),
    (req, res) => {
      const user = req.user;

      // Send user data to frontend
      res.send(`
        <script>
          window.opener.postMessage(${JSON.stringify({ email: user.emails[0].value })}, window.origin);
          window.close();
        </script>
      `);
    },
  ],

  getProfile: (req, res) => {
    if (!req.user) return res.redirect("/auth-main");
    res.send(`Welcome`);
  },

  logout: (req, res) => {
    req.logout(() => {
      res.redirect("/auth-main");
    });
  },
};

module.exports = { sendOTP, googleauthController };
