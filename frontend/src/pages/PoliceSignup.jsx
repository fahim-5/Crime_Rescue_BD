import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css"; // Using the same CSS file as SignupForm

const PoliceSignup = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    national_id: "",
    passport: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    role: "police",
    address: "",
    police_id: "",
    badge_number: "",
    rank: "",
    station: "",
    joining_date: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.full_name ||
      !formData.username ||
      !formData.email ||
      !formData.national_id ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.mobile ||
      !formData.address ||
      !formData.badge_number ||
      !formData.rank ||
      !formData.station ||
      !formData.joining_date||
      !formData.police_id
    ) {
      setError("All fields are required.");
      return;
    }

    // Validate Password Match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Validate Address Format (District-Thana)
    const addressPattern = /^[a-zA-Z\s]+-[a-zA-Z\s]+$/;
    if (!addressPattern.test(formData.address)) {
      setError(
        "Enter a valid address in the format: District-Thana (e.g., Dhaka-Mirpur)."
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/police/requests",
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred while signing up."
      );
    }
  };

  return (
    <main className="auth-signup-container">
      <section className="auth-signup-box">
        <h2 className="auth-signup-title">Create Your Account</h2>
        <h3 className="auth-signup-indication">As a Law Enforcement Officer</h3>
        {error && <p className="auth-error-message">{error}</p>}
        {success && <p className="auth-success-message">{success}</p>}

        <form onSubmit={handleSubmit} className="auth-signup-form">
          <div className="auth-left">
            <label className="auth-label">Full Name</label>
            <input
              type="text"
              name="full_name"
              className="auth-input"
              placeholder="Enter your full name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />

            <label className="auth-label">Username</label>
            <input
              type="text"
              name="username"
              className="auth-input"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <label className="auth-label">Email</label>
            <input
              type="email"
              name="email"
              className="auth-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label className="auth-label">National ID</label>
            <input
              type="text"
              name="national_id"
              className="auth-input"
              placeholder="Enter your National ID"
              value={formData.national_id}
              onChange={handleChange}
              required
            />

            <label className="auth-label">Mobile Number</label>
            <input
              type="text"
              name="mobile"
              className="auth-input"
              placeholder="Enter your mobile number"
              value={formData.mobile}
              onChange={handleChange}
              required
            />

            <label className="auth-label">Address (District-Thana)</label>
            <input
              type="text"
              name="address"
              className="auth-input"
              placeholder="Enter your address (e.g., Dhaka-Mirpur)"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <label className="auth-label">Passport (Optional)</label>
            <input
              type="text"
              name="passport"
              className="auth-input"
              placeholder="Enter your passport number (if applicable)"
              value={formData.passport}
              onChange={handleChange}
            />
          </div>

          <div className="auth-right">

          <label className="auth-label">Enter Police ID</label>
            <input
              type="text"
              name="police_id"
              className="auth-input"
              placeholder="Enter your poilce ID"
              value={formData.police_id}
              onChange={handleChange}
              required
            />
            <label className="auth-label">Badge Number</label>
            <input
              type="text"
              name="badge_number"
              className="auth-input"
              placeholder="Enter your badge number"
              value={formData.badge_number}
              onChange={handleChange}
              required
            />

            <label className="auth-label">Rank</label>
            <input
              type="text"
              name="rank"
              className="auth-input"
              placeholder="Enter your rank"
              value={formData.rank}
              onChange={handleChange}
              required
            />

            <label className="auth-label">Station</label>
            <input
              type="text"
              name="station"
              className="auth-input"
              placeholder="Enter your police station"
              value={formData.station}
              onChange={handleChange}
              required
            />

            <label className="auth-label">Joining Date</label>
            <input
              type="date"
              name="joining_date"
              className="auth-input"
              value={formData.joining_date}
              onChange={handleChange}
              required
            />

            <label className="auth-label">Password</label>
            <input
              type="password"
              name="password"
              className="auth-input"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <label className="auth-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="auth-input"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <input type="hidden" name="role" value="police" />

          <button type="submit" className="auth-signup-button">
            Sign Up
          </button>
        </form>

        <p className="auth-signup-footer">
          Already have an account?{" "}
          <span className="auth-signup-link" onClick={() => navigate("/")}>
            Log in
          </span>
        </p>
      </section>
    </main>
  );
};

export default PoliceSignup;
