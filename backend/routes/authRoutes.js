const express = require("express");
const passport = require("passport");
const User = require("../models/User");
const { ensureGuest, ensureAuthenticated } = require("../middleware/auth");
const path = require("path");

const router = express.Router();

// ✅ Serve login page
router.get("/login", ensureGuest, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "login.html"));
});

// ✅ Serve register page
router.get("/register", ensureGuest, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/register.html"));
});

// ✅ Register a new user
router.post("/register", async (req, res) => {
    try {
        console.log("📥 Received registration request:", req.body); // ✅ Debugging input data

        const { username, email, password, confirmPassword } = req.body;

        // ✅ Validate missing fields
        if (!username || !email || !password || !confirmPassword) {
            console.log("❌ Missing required fields");
            return res.status(400).json({ error: "All fields are required" });
        }

        // ✅ Check if passwords match
        if (password !== confirmPassword) {
            console.log("❌ Passwords do not match");
            return res.status(400).json({ error: "Passwords do not match" });
        }

        // ✅ Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log("❌ Invalid Email Format");
            return res.status(400).json({ error: "Invalid email format" });
        }

        // ✅ Check if username already exists (MOVE ABOVE EMAIL CHECK)
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            console.log("❌ Username already taken");
            return res.status(400).json({ error: "Username already taken" });
        }

        // ✅ Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            console.log("❌ Email already registered");
            return res.status(400).json({ error: "Email already registered" });
        }

        // ✅ Debug before registering
        console.log("🚀 Attempting to register new user...");

        // ✅ Register user using Passport
        const newUser = new User({ username, email });
        await User.register(newUser, password);

        console.log(`✔ User Registered: ${username} (${email})`);
        res.status(201).json({ success: true, message: "Registration successful!" });

    } catch (err) {
        console.error("❌ Registration error:", err);
        res.status(500).json({ error: "Registration failed. Please try again." });
    }
});

// ✅ Local login
router.post("/login", ensureGuest, (req, res, next) => {
    console.log("📥 Login request received:", req.body);

    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.error("❌ Authentication error:", err);
            return res.status(500).json({ message: "Server error. Please try again later." });
        }
        if (!user) {
            console.warn("❌ Invalid login attempt:", info);
            return res.status(401).json({ message: "Incorrect email or password." });
        }

        req.logIn(user, (err) => {
            if (err) {
                console.error("❌ Error logging in:", err);
                return res.status(500).json({ message: "Login failed. Please try again." });
            }
            console.log(`✅ Login successful: ${user.email}`);
            return res.json({ success: true, message: "Login successful!" });
        });
    })(req, res, next);
});

// ✅ Logout
router.get("/logout", (req, res) => {
    req.logout(() => {
        res.json({ message: "Logged out successfully." });
    });
});

// ✅ Redirect User to GitHub for Authentication
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// ✅ GitHub Callback URL (Handles GitHub Login Response)
router.get("/github/callback",
    passport.authenticate("github", { failureRedirect: process.env.CLIENT_URL + "/login" }),
    (req, res) => {
        console.log("✅ GitHub Authentication Successful", req.user);
        res.redirect(process.env.CLIENT_URL + "/dashboard"); // Redirect to dashboard upon successful login
    }
);

// ✅ Check authentication status
router.get("/check-auth", (req, res) => {
    console.log("🔍 Checking authentication status...");
    console.log("Session data:", req.session); // ✅ Debugging session storage
    console.log("User data:", req.user); // ✅ Check if user exists in session

    if (req.isAuthenticated()) {
        console.log("✅ User is authenticated:", req.user);
        return res.json({ authenticated: true, user: req.user });
    } else {
        console.log("❌ User is not authenticated");
        return res.json({ authenticated: false });
    }
});

module.exports = router;