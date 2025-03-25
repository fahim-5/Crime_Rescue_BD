const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const loginMiddleware = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required!" });
  }

  try {
    // Find user by email (Including Password)
    const user = await UserModel.findByEmail(email);
    
    if (!user || !user.password) {
      return res.status(404).json({ message: "Invalid credentials." });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    req.token = token; // Store token for further use
    req.user = { id: user.id, email: user.email, role: user.role };

    next(); // Proceed to the next handler

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

// Logout Middleware
const logoutMiddleware = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};



const registerUser = async (req, res) => {
  try {
    // Your registration logic
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
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




module.exports = { loginMiddleware, logoutMiddleware ,registerUser, loginUser };
