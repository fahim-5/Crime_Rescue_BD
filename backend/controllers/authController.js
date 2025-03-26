const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const registerUser = async (req, res) => {
  try {
    const { 
      full_name, 
      username, 
      email, 
      national_id, 
      mobile_no,  // Changed from mobile to mobile_no
      password, 
      confirmPassword, 
      address, 
      role 
    } = req.body;

    // Validate required fields
    if (!full_name || !username || !email || !national_id || !mobile_no || 
        !password || !confirmPassword || !address || !role) {
      return res.status(400).json({ 
        message: "All fields are required.",
        fields: {
          full_name: !full_name,
          username: !username,
          email: !email,
          national_id: !national_id,
          mobile_no: !mobile_no,
          password: !password,
          confirmPassword: !confirmPassword,
          address: !address,
          role: !role
        }
      });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Validate address format
    const addressPattern = /^[a-zA-Z\s]+-[a-zA-Z\s]+$/;
    if (!addressPattern.test(address)) {
      return res.status(400).json({
        message: "Enter a valid address in the format: District-Thana (e.g., Dhaka-Mirpur).",
      });
    }

    // Validate role
    const validRoles = ["public", "police", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        message: "Invalid role. Choose from: public, police, admin." 
      });
    }

    // Prepare data for model
    const userData = {
      full_name,
      username,
      email,
      national_id,
      mobile: mobile_no, // Map to mobile for model
      password,
      address,
      role
    };

    const newUser = await UserModel.create(userData);

    res.status(201).json({ 
      message: "User registered successfully.", 
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error("Registration Error:", error);
    const status = error.status || 500;
    const message = error.message || "Server error during registration.";
    res.status(status).json({ 
      message,
      errors: error.errors,
      details: error.details
    });
  }
};

const loginUser = async (req, res) => {
  try {
    // Your login logic
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { registerUser, loginUser };