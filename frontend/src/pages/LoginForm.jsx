import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginForm.css"; // Ensure isolated styling

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      setError("Both fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        credentials,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // Ensures cookies are sent if using session-based auth
        }
      );

      if (response.status === 200) {
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    }
  };

  return (
    <main className="auth-container">
      <section className="auth-box">
        <h2 className="auth-title">Sign in to Your Account</h2>

        {error && <p className="auth-error-message">{error}</p>}
        {success && <p className="auth-success-message">{success}</p>}

        <form onSubmit={handleLoginSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="auth-email" className="auth-label">
              Email or Username
            </label>
            <input
              type="email"
              id="auth-email"
              name="email"
              className="auth-input"
              placeholder="Enter your email or username"
              value={credentials.email}
              onChange={handleInputChange}
              required
              autoFocus
            />
          </div>

          <div className="input-group">
            <label htmlFor="auth-password" className="auth-label">
              Password
            </label>
            <input
              type="password"
              id="auth-password"
              name="password"
              className="auth-input"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="auth-button">Login</button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <a href="/signup" className="auth-link">Sign Up</a>
        </p>
      </section>
    </main>
  );
};

export default LoginForm;
