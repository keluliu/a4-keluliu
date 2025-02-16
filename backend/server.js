const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const User = require("./models/User");
const LocalStrategy = require("passport-local").Strategy;
const Todo = require("./models/Todo");
const MongoStore = require("connect-mongo");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Connect to MongoDB
connectDB();

// ✅ Fix CORS Issue (Frontend runs on port 5173)
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, // ✅ Allows frontend to send cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Express Session Middleware (Required for Passport)
app.use(session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI, // Ensure this is in your .env file
        collectionName: "sessions"
    }),
    cookie: {
        secure: false, // Set to `true` if using HTTPS
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days session persistence
    }
}));

// ✅ Initialize Passport for Authentication
app.use(passport.initialize());
app.use(passport.session());

// ✅ Passport Local Strategy
passport.use(new LocalStrategy(
    { usernameField: "email", passReqToCallback: true }, // Pass req to callback for logging
    async (req, email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                console.warn(`❌ Login failed: Email not found (${email})`);
                return done(null, false, { message: "Incorrect email or password." });
            }

            // Use Passport's built-in `authenticate` method to verify the password
            user.authenticate(password, (err, authenticatedUser) => {
                if (err) {
                    console.error("❌ Authentication error:", err);
                    return done(err);
                }
                if (!authenticatedUser) {
                    console.warn("❌ Incorrect password");
                    return done(null, false, { message: "Incorrect email or password." });
                }
                console.log(`✅ User authenticated: ${email}`);
                return done(null, user);
            });
        } catch (err) {
            return done(err);
        }
    }
));

// ✅ GitHub OAuth Strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL, // Must match GitHub settings
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ githubId: profile.id });
                if (!user) {
                    user = await User.create({ githubId: profile.id, username: profile.username });
                }
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

// ✅ Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// ✅ Serve Built React Frontend (Production Mode)
const frontendPath = path.join(__dirname, "../dist");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"), (err) => {
        if (err) res.status(500).send(err);
    });
});

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));