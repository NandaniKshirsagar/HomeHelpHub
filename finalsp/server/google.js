require("dotenv").config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Allow frontend requests
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: "79977128008-oh5sccgmgdrhvb5e1nsee9imombqveor.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:5001/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Redirect user to Google account selection
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Handle callback from Google
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:5173/account"); // Redirect to frontend after login
  }
);

// Send user data to frontend
app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user); // Send user info as JSON
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("http://localhost:5173"); // Redirect to frontend on logout
  });
});

app.listen(5001, () => {
  console.log("Server running on port 5001");
});

app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json(req.user); // Send user details
});
