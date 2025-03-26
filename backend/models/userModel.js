const { pool } = require("../config/db");
const bcrypt = require("bcryptjs");

class UserModel {
  static async create(userData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Destructure with validation
      const {
        full_name = '',
        username = '',
        email = '',
        national_id = '',
        mobile = '',  // Comes from mobile_no in controller
        password = '',
        address = '',
        role = '',
        passport = null
      } = userData;

      // Validate required fields
      const requiredFields = {
        full_name,
        username,
        email,
        national_id,
        mobile,
        password,
        address,
        role
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([key, value]) => !value || (typeof value === 'string' && value.trim() === ''))
        .map(([key]) => key);

      if (missingFields.length > 0) {
        throw {
          status: 400,
          message: 'Missing required fields',
          fields: missingFields
        };
      }

      // Check for existing user
      const [existingUsers] = await connection.query(
        "SELECT * FROM users WHERE email = ? OR username = ? OR national_id = ?",
        [email.trim(), username.trim(), national_id.trim()]
      );

      if (existingUsers.length > 0) {
        const errors = [];
        if (existingUsers.some(u => u.email === email.trim())) {
          errors.push({ field: "email", message: "Email already in use" });
        }
        if (existingUsers.some(u => u.username === username.trim())) {
          errors.push({ field: "username", message: "Username already taken" });
        }
        if (existingUsers.some(u => u.national_id === national_id.trim())) {
          errors.push({ field: "national_id", message: "National ID already registered" });
        }
        throw { status: 400, errors };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const [result] = await connection.query(
        `INSERT INTO users 
        (full_name, username, email, national_id, passport, mobile_no, password, role, address) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          full_name.trim(),
          username.trim().toLowerCase(),
          email.trim().toLowerCase(),
          national_id.trim(),
          passport ? passport.trim() : null,
          mobile.trim(), // Maps to mobile_no in database
          hashedPassword,
          role.trim().toLowerCase(),
          address.trim()
        ]
      );

      await connection.commit();

      return {
        id: result.insertId,
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        role: role.trim().toLowerCase()
      };
    } catch (error) {
      await connection.rollback();
      console.error('Database Error:', {
        code: error.code,
        sqlMessage: error.sqlMessage,
        stack: error.stack
      });
      
      if (error.code === 'ER_DUP_ENTRY') {
        throw { 
          status: 409, 
          message: 'Duplicate entry',
          details: error.sqlMessage 
        };
      }
      throw error;
    } finally {
      if (connection) await connection.release();
    }
  }

  static async findByEmail(email) {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query(
        "SELECT id, email, password, role FROM users WHERE email = ?",
        [email.toLowerCase().trim()]
      );
      return users[0] || null;
    } finally {
      await connection.release();
    }
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = UserModel;