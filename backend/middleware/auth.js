module.exports = {
    ensureAuthenticated: (req, res, next) => {
        console.log("🔍 Checking Authentication...");
        console.log("🔹 req.user:", req.user); // ✅ Debug user object

        if (req.isAuthenticated() && req.user) {
            return next();
        }

        console.error("❌ Authentication Failed: User not logged in.");
        res.status(401).json({ message: "Unauthorized: Please log in again." });
    },
    ensureGuest: (req, res, next) => {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.status(403).json({ message: "Forbidden: Already logged in." });
    },
};