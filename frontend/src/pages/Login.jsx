import React, { useEffect, useState } from "react";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Dynamically create a <link> element for login-output.css
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/frontend/src/css/login-output.css"; // Ensure correct path
        link.id = "login-style"; // Give it an ID for removal

        document.head.appendChild(link); // Append to <head>

        return () => {
            // Remove the stylesheet when navigating away
            document.getElementById("login-style")?.remove();
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(email, password);
            if (response.success) {
                toast.success("✅ Login successful! Redirecting...");
                localStorage.setItem("isAuthenticated", "true");
                setIsAuthenticated(true); // ✅ Trigger re-render
                setTimeout(() => navigate("/dashboard"), 100); // ✅ Redirect to dashboard
            } else {
                toast.error(response.message || "❌ Login failed! Check credentials.");
                setError(response.message || "❌ Login failed!");
            }
        } catch (error) {
            toast.error(error.message || "❌ Login failed!");
            setError(error.message || "❌ Login failed!");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="text-3xl font-semibold text-center text-gray-800">🔑 Login</h2>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {/* Email Input */}
                    <div className="input-group">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            📧 Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="input-group">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            🔒 Password
                        </label>
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

                    {/* Error Message */}
                    {error && <p className="error-text">{error}</p>}

                    {/* Login Button */}
                    <button type="submit" className="primary-btn">
                        Login
                    </button>

                    <div className="divider">
                        <hr />
                        <span className="or-text">OR</span>
                        <hr />
                    </div>

                    {/* GitHub Login */}
                    <a href="http://localhost:3000/api/auth/github" className="github-btn">
                        🔗 Login with GitHub
                    </a>

                    {/* Register Link */}
                    <p className="bottom-text">
                        Don't have an account?{" "}
                        <a href="/Register" className="text-blue-500 hover:underline">
                            Register here
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;