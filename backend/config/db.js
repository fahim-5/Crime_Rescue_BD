const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "Fahim",
  password: process.env.DB_PASSWORD || "fahimfaysal",
  database: process.env.DB_NAME || "Crime_Rescue_BD",
  waitForConnections: true, // Allows the pool to wait for connections
  connectionLimit: 10, // Max number of connections in the pool
  queueLimit: 0, // No limit to the queue
});

const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL Database Connected");
    return connection;
  } catch (error) {
    console.error("❌ MySQL Connection Failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;
