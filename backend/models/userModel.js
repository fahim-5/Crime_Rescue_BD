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

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

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
      // Re-throw custom errors
      if (error.errors) throw error;
      
      console.error('Error creating user:', error);
      throw { status: 500, message: 'Failed to create user' };
    } finally {
      connection.release();
    }
  }

  /**
   * Find user by email
   * @param {string} email
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findByEmail(email) {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query(
        "SELECT * FROM users WHERE email = ?",
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
   * Find user by username
   * @param {string} username
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findByUsername(username) {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query(
        "SELECT * FROM users WHERE username = ?",
        [username.trim()]
      );
      return users[0] || null;
    } catch (error) {
      console.error('Error finding user by username:', error);
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

  /**
   * Get user by ID (without sensitive info)
   * @param {number} id
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async getById(id) {
    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query(
        `SELECT id, full_name, username, email, national_id, passport, 
         mobile_no, address, role, created_at 
         FROM users WHERE id = ?`,
        [id]
      );
      return users[0] || null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw { status: 500, message: 'Failed to fetch user' };
    } finally {
      connection.release();
    }
  }

  /**
   * Update user information
   * @param {number} id
   * @param {Object} updates
   * @returns {Promise<number>} Number of affected rows
   */
  static async update(id, updates) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const fieldsToUpdate = [];
      const values = [];

      // Dynamic field updates
      if (updates.full_name !== undefined) {
        fieldsToUpdate.push("full_name = ?");
        values.push(updates.full_name.trim());
      }
      if (updates.username !== undefined) {
        fieldsToUpdate.push("username = ?");
        values.push(updates.username.trim());
      }
      if (updates.email !== undefined) {
        fieldsToUpdate.push("email = ?");
        values.push(updates.email.toLowerCase().trim());
      }
      if (updates.mobile !== undefined) {
        fieldsToUpdate.push("mobile_no = ?");
        values.push(updates.mobile.trim());
      }
      if (updates.address !== undefined) {
        fieldsToUpdate.push("address = ?");
        values.push(updates.address.trim());
      }
      if (updates.role !== undefined) {
        fieldsToUpdate.push("role = ?");
        values.push(updates.role.toLowerCase());
      }

      if (fieldsToUpdate.length === 0) {
        throw { status: 400, message: "No valid fields provided for update" };
      }

      values.push(id);
      const query = `UPDATE users SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;

      const [result] = await connection.query(query, values);
      await connection.commit();

      return result.affectedRows;
    } catch (error) {
      await connection.rollback();
      console.error('Error updating user:', error);
      throw error.status ? error : { status: 500, message: 'Failed to update user' };
    } finally {
      connection.release();
    }
  }

  /**
   * Delete user by ID
   * @param {number} id
   * @returns {Promise<number>} Number of affected rows
   */
  static async delete(id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.query(
        "DELETE FROM users WHERE id = ?",
        [id]
      );
      await connection.commit();
      return result.affectedRows;
    } catch (error) {
      await connection.rollback();
      console.error('Error deleting user:', error);
      throw { status: 500, message: 'Failed to delete user' };
    } finally {
      connection.release();
    }
  }
}

module.exports = UserModel;