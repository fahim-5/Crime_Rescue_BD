const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db"); // Ensure db is properly required

// Middleware for handling login logic
const loginMiddleware = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required!" });
  }

  try {
    // Check if the user exists with the provided email
    const [user] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // If the credentials are valid, create a JWT token for the user
    const token = jwt.sign({ userId: user[0].id, username: user[0].username }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Store token in response or set it in cookies (for session management)
    req.token = token; // Store the token for the next middleware/route handler

    // You could also use a session or cookie instead of sending the token here if needed
    next(); // Proceed to the actual login route handler
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

// Middleware for handling logout logic
const logoutMiddleware = (req, res, next) => {
  try {
    // Clear user session or token (If using JWT token in cookies)
    res.clearCookie("token"); // If you're storing JWT in cookies
    // If you're using session, you can do:
    // req.session.destroy();

    res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

module.exports = { loginMiddleware, logoutMiddleware };
