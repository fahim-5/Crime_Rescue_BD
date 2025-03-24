const UserModel = require("../models/userModel"); // Changed to import the class
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    // Changed from createUser() to create()
    const newUser = await UserModel.create(req.body);
    
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser // Changed from result.user to newUser
    });

  } catch (error) {
    if (error.errors) {
      return res.status(error.status || 400).json({
        success: false,
        message: "Registration failed",
        errors: error.errors
      });
    }
    
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Registration failed",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // 1. Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // 2. Verify role
    if (user.role !== role.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: "Access denied for this role"
      });
    }

    // 3. Verify password
    const isMatch = await UserModel.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 5. Return success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};