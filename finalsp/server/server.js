require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passportConfig");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const dashRoutes = require("./routes/dashBoardRoute");
const requestRoutes = require("./routes/requestRoute");
require("./config/firebasedb"); // Ensures Firebase connection is initialized
const multer = require('multer');

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json()); // Ensure body parsing middleware is enabled
app.use(cors({ origin: "*", credentials: true }));
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use('/api/dash',dashRoutes);
app.use('/api/request',requestRoutes); // New Route
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});