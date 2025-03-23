const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectDB = require("../config/db");

exports.registerUser = async (req, res) => {
  const { full_name, username, email, national_id, passport, mobile, password, role } = req.body;

  // Ensure all required fields are filled, including mobile number
  if (!full_name || !username || !email || !national_id || !password || !role || !mobile) {
    return res.status(400).json({ message: "All required fields must be filled" });
  }

  // Validate password strength (e.g., min length)
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long and include a mix of upper, lower case letters, and numbers.",
    });
  }

  try {
    const connection = await connectDB();
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password

    // Check if the user already exists based on email
    const [existingUser] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    // Insert new user into the database
    const [result] = await connection.execute(
      "INSERT INTO users (full_name, username, email, national_id, passport, mobile, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [full_name, username, email, national_id, passport || null, mobile, hashedPassword, role]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt for email:", email); // ✅ Debug log

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const connection = await connectDB();
    const [users] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);

    console.log("User found:", users.length > 0 ? users[0] : "No user found"); // ✅ Debug log

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password match:", isMatch); // ✅ Debug log

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Login successful, token generated"); // ✅ Debug log

    res.status(200).json({
      message: "Login successful.",
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
