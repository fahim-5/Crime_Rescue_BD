const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const loginMiddleware = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
    }

    // Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Check if the user has a stored password
    if (!user.password) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT Token with a secure expiration time
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" } // Increased expiration time for better usability
    );

    // Store user data in request for further use
    req.token = token;
    req.user = { id: user.id, email: user.email, role: user.role };

    next(); // Proceed to the next middleware or controller

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};


const logoutMiddleware = (req, res) => {
  try {
    // Clear the JWT Token (if stored in cookies, localStorage, or sessionStorage)
    res.clearCookie('token');  // If you store the token as a cookie

    // Alternatively, you can manage blacklisting of tokens on the server side using Redis or a database

    // Return a response indicating the user has been logged out
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "An error occurred during logout." });
  }
};

module.exports = logoutMiddleware;

module.exports = loginMiddleware;
