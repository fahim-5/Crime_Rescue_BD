const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectDB = require("../config/db");

exports.registerUser = async (req, res) => {
  const { full_name, username, email, national_id, passport, mobile, address, password, role } = req.body;

  // Ensure all required fields are filled, including address
  if (!full_name || !username || !email || !national_id || !password || !role || !mobile || !address) {
    return res.status(400).json({ message: "All required fields must be filled" });
  }

  // Validate password strength (at least 8 characters, includes letters & numbers)
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long and include a mix of letters and numbers.",
    });
  }

  try {
    const connection = await connectDB();
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password

    // Check if user already exists based on email
    const [existingUser] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    // Convert role to lowercase
    const lowerCaseRole = role.toLowerCase();

    // Insert new user into the database
    const [result] = await connection.execute(
      "INSERT INTO users (full_name, username, email, national_id, passport, mobile_no, address, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [full_name, username, email, national_id, passport || null, mobile, address, hashedPassword, lowerCaseRole]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error registering user",
      error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong. Please try again later.",
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body; // Role should be passed in the body as well
    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const connection = await connectDB();
    const [users] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Validate the role: Ensure that the logged-in user’s role matches the role passed in the request
    if (user.role !== role) {
      return res.status(403).json({ message: "Role mismatch. You do not have access to this role." });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || "defaultSecretKey", // Avoid crashing if missing in dev
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      user: { id: user.id, email: user.email, address: user.address, role: user.role }, // ✅ Include address in response
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
