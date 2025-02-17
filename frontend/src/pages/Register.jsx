import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Dynamically create a <link> element for register-output.css
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/frontend/public/css/register-output.css"; // Ensure correct path
        link.id = "register-style"; // Give it an ID for removal

        document.head.appendChild(link); // Append to <head>

        return () => {
            // Remove the stylesheet when navigating away
            document.getElementById("register-style")?.remove();
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ Check if passwords match
        if (password !== confirmPassword) {
            setPasswordError("❌ Passwords do not match!"); // ✅ Show UI error
            console.error("❌ Passwords do not match!"); // ✅ Log error in console
            toast.error("❌ Passwords do not match!"); // ✅ Show toast notification
            return;
        } else {
            setPasswordError("");
        }

        const requestData = { username, email, password, confirmPassword }; // ✅ Include confirmPassword
        console.log("📤 Sending registration request:", requestData); // ✅ Debugging request

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData), // ✅ Ensure confirmPassword is sent
            });

            const result = await response.json();
            console.log("🔄 Server response:", result); // ✅ Debugging response

            if (response.ok && result.success) {
                toast.success("✅ Registration successful! Redirecting to login...");
                navigate("/login");
            } else {
                setError(result.error || "❌ Registration failed!"); // ✅ Show UI error
                console.error("❌ Registration error:", result.error); // ✅ Log error in console
                toast.error(`❌ ${result.error || "Registration failed!"}`); // ✅ Show toast notification
            }
        } catch (error) {
            console.error("❌ Network or Server Error:", error); // ✅ Log network error in console
            setError("An error occurred. Please try again."); // ✅ Show UI error
            toast.error("❌ An error occurred. Please try again."); // ✅ Show toast notification
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">📝 Register</h2>

                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Username */}
                    <div className="input-group">
                        <label htmlFor="username" className="input-label">👤 Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>

                    {/* Email */}
                    <div className="input-group">
                        <label htmlFor="email" className="input-label">📧 Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                            className="input-field"
                        />
                    </div>

                    {/* Password */}
                    <div className="input-group">
                        <label htmlFor="password" className="input-label">🔒 Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="input-group">
                        <label htmlFor="confirm-password" className="input-label">🔐 Confirm Password</label>
                        <input
                            type="password"
                            id="confirm-password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="input-field"
                        />
                        {/* Show Password Mismatch Error Below */}
                        {passwordError && <p className="error-text">{passwordError}</p>}
                    </div>

                    {/* Register Button */}
                    <button type="submit" className="primary-btn">Register</button>

                    {error && <p className="error-text">{error}</p>}
                </form>

                {/* Back to Login */}
                <p className="bottom-text">
                    Already have an account?{" "}
                    <a href="/login" className="login-link">Login here</a>
                </p>
            </div>
        </div>
    );
};

export default Register;