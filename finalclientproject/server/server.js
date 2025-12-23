require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passportConfig");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const providerRoutes=require("./routes/providerRoutes");
const submitBokkingRoutes = require("./routes/submitBokkingRoutes"); // Import the booking routes
const requestRoutes = require("./routes/requestRoute"); // Import the request routes
require("./config/firebasedb"); // Ensures Firebase connection is initialized

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/provider",providerRoutes);
app.use("/api/getproviderDetails",providerRoutes);
app.use("/api/booking",submitBokkingRoutes); // Add this line to handle booking submissions
app.use("/api/request", requestRoutes); // Add this line to handle request updates
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});