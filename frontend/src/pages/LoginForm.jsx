import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/useAuth"; // Assuming the context exists
import "./LoginForm.css"; // Ensure isolated styling

const LoginForm = () => {
  const { login } = useAuth(); // Extract login function from context to set user in state
  const [credentials, setCredentials] = useState({ email: "", password: "", role: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password || !credentials.role) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login", // Adjust your backend API URL here
        {
          email: credentials.email,
          password: credentials.password,
          role: credentials.role, // Send the role to backend for validation
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        const { user, token } = response.data;
        login({ token, ...user }); // Set the user and token in context/state

        setSuccess("Login successful! Redirecting...");

        // Redirect based on user role
        setTimeout(() => {
          if (user?.role === "admin") {
            navigate("/admin-dashboard");
          } else if (user?.role === "police") {
            navigate("/police-dashboard");
          } else {
            navigate("/home"); // Default route for public users
          }
        }, 2000);
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
            <label htmlFor="auth-email" className="auth-label">Email</label>
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
            <label htmlFor="auth-password" className="auth-label">Password</label>
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

          <div className="input-group auth-role-section">
            <label className="auth-label">Select Role</label>
            <div className="auth-role-options">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="public"
                  onChange={handleInputChange}
                />
                Public
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="police"
                  onChange={handleInputChange}
                />
                Police
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  onChange={handleInputChange}
                />
                Admin
              </label>
            </div>
          </div>

          <button type="submit" className="auth-button">Login</button>
        </form>

        <p className="auth-footer">
          Don't have an account? <a href="/" className="auth-link">Sign Up</a>
        </p>
      </section>
    </main>
  );
};

export default LoginForm;
