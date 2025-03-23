import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignupForm.css";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    national_id: "",
    passport: "",
    mobile: "", // Added mobile number field
    password: "",
    confirmPassword: "",
    role: "", 
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let newValue = value;
  
    if (name === "full_name") {
      newValue = value.replace(/\s+/g, ' '); // Allow spaces within, trim outside
    } else {
      newValue = value.trim(); // Other fields remain normal
    }
  
    setFormData({ ...formData, [name]: newValue });
  };

  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Ensure all required fields are filled
    if (
      !formData.full_name ||
      !formData.username ||
      !formData.email ||
      !formData.national_id ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.role ||
      !formData.mobile // Ensure mobile number is filled
    ) {
      setError("All fields are required.");
      return;
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Send cleaned data
    const userData = {
      full_name: formData.full_name,
      username: formData.username,
      email: formData.email,
      national_id: formData.national_id,
      mobile: formData.mobile, // Include mobile number
      passport: formData.passport || null, // Store null if empty
      password: formData.password,
      role: formData.role,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", userData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.status === 201) {
        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while signing up.");
    }
  };

  return (
    <main className="auth-signup-container">
      <section className="auth-signup-box">
        <h2 className="auth-signup-title">Create Your Account</h2>
        {error && <p className="auth-error-message">{error}</p>}
        {success && <p className="auth-success-message">{success}</p>}
        
        <form onSubmit={handleSubmit} className="auth-signup-form">
          <div className="auth-left">
            <label htmlFor="full_name" className="auth-label">Full Name</label>
            <input 
              type="text" 
              id="full_name" 
              name="full_name" 
              className="auth-input" 
              placeholder="Enter your full name" 
              value={formData.full_name} 
              onChange={handleChange} 
              required 
            />

            <label htmlFor="username" className="auth-label">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              className="auth-input" 
              placeholder="Choose a username" 
              value={formData.username} 
              onChange={handleChange} 
              required 
            />

            <label htmlFor="email" className="auth-label">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className="auth-input" 
              placeholder="Enter your email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />

            <label htmlFor="national_id" className="auth-label">National ID</label>
            <input 
              type="text" 
              id="national_id" 
              name="national_id" 
              className="auth-input" 
              placeholder="Enter your National ID" 
              value={formData.national_id} 
              onChange={handleChange} 
              required 
            />

            <label htmlFor="mobile" className="auth-label">Mobile Number</label>
            <input 
              type="text" 
              id="mobile" 
              name="mobile" 
              className="auth-input" 
              placeholder="Enter your mobile number" 
              value={formData.mobile} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="auth-right">
            <label htmlFor="passport" className="auth-label">Passport (Optional)</label>
            <input 
              type="text" 
              id="passport" 
              name="passport" 
              className="auth-input" 
              placeholder="Enter your passport number (if applicable)" 
              value={formData.passport} 
              onChange={handleChange} 
            />

            <label htmlFor="password" className="auth-label">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              className="auth-input" 
              placeholder="Create a password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />

            <label htmlFor="confirmPassword" className="auth-label">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              className="auth-input" 
              placeholder="Confirm your password" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              required 
            />

            <div className="auth-role-section" style={{ marginTop: "15px" }}>
              <label className="auth-label">Select Role:</label>
              <div className="auth-role-options" style={{ marginTop: "10px" }}>
                <label style={{ marginRight: "65px" }}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="Public" 
                    checked={formData.role === "Public"} 
                    onChange={handleRoleChange} 
                  /> Public
                </label>
                <label style={{ marginRight: "65px" }}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="Police" 
                    checked={formData.role === "Police"} 
                    onChange={handleRoleChange} 
                  /> Police
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="role" 
                    value="Admin" 
                    checked={formData.role === "Admin"} 
                    onChange={handleRoleChange} 
                  /> Admin
                </label>
              </div>
            </div>
          </div>

          <button type="submit" className="auth-signup-button">Sign Up</button>
        </form>

        <p className="auth-signup-footer">
          Already have an account?{" "}
          <span className="auth-signup-link" onClick={() => navigate("/login")}>Log in</span>
        </p>
      </section>
    </main>
  );
};

export default SignupForm;
