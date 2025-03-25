const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");

class UserModel {
  /**
   * Create a new user
   * @param {Object} userData - User information
   * @returns {Promise<Object>} Created user info (without password)
   */
  static async create(userData) {
    const {
      full_name,
      username,
      email,
      national_id,
      passport = null,
      mobile,
      address,
      password,
      role
    } = userData;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Check for existing user
      const [existingUsers] = await connection.query(
        "SELECT * FROM users WHERE email = ? OR username = ?",
        [email, username]
      );

      if (existingUsers.length > 0) {
        const errors = [];
        if (existingUsers.some(u => u.email === email)) {
          errors.push({ field: "email", message: "Email already in use" });
        }
        if (existingUsers.some(u => u.username === username)) {
          errors.push({ field: "username", message: "Username already taken" });
        }
        throw { status: 400, errors };
      }

      // Hash password securely
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const [result] = await connection.query(
        `INSERT INTO users 
        (full_name, username, email, national_id, passport, mobile_no, address, password, role) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          full_name.trim(),
          username.trim(),
          email.toLowerCase().trim(),
          national_id.trim(),
          passport ? passport.trim() : null,
          mobile.trim(),
          address.trim(),
          hashedPassword,
          role.toLowerCase()
        ]
      );

      await connection.commit();

      return {
        id: result.insertId,
        username,
        email,
        role: role.toLowerCase()
      };

    } catch (error) {
      await connection.rollback();
      if (error.errors) throw error;
      
      console.error('Error creating user:', error);
      throw { status: 500, message: 'Failed to create user' };
    } finally {
      connection.release();
    }
  }

  /**
   * Find user by email (Including Password)
   * @param {string} email
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findByEmail(email) {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query(
        "SELECT id, email, password, role FROM users WHERE email = ?",
        [email.toLowerCase().trim()]
      );
      return users[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw { status: 500, message: 'Failed to find user' };
    } finally {
      connection.release();
    }
  }

  /**
   * Compare password with hashed password
   * @param {string} candidatePassword
   * @param {string} hashedPassword
   * @returns {Promise<boolean>}
   */
  static async comparePassword(candidatePassword, hashedPassword) {
    try {
      return await bcrypt.compare(candidatePassword, hashedPassword);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      throw { status: 500, message: 'Failed to verify password' };
    }
  }
}

module.exports = UserModel;

