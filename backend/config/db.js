const mysql = require("mysql2/promise"); // Use promise-based connection
require("dotenv").config();

const connectDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("✅ MySQL Database Connected");
    return connection;
  } catch (error) {
    console.error("❌ MySQL Connection Failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;
