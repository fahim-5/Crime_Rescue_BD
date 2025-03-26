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
  const { email, password, role } = req.body;

  try {
    // Validate required fields
    if (!email || !password || !role) {
      return res.status(400).json({ 
        success: false,
        message: "Email, password and role are required" 
      });
    }

    // Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Verify role matches
    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message: "Access denied for this role"
      });
    }

    // Verify password
    const isMatch = await UserModel.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Return success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        username: user.username
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};



module.exports = { registerUser, loginUser };