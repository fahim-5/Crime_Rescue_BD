const { pool } = require("../config/db");

const RequestModel = {
  createPoliceRequest: async (policeData) => {
    const query = `
      INSERT INTO requests (
        full_name, username, email, national_id, passport, mobile, password_hash, 
        role, address, police_id, badge_number, rank, station, joining_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      policeData.full_name,
      policeData.username,
      policeData.email,
      policeData.national_id,
      policeData.passport || null,
      policeData.mobile,
      policeData.password_hash, // Already hashed
      "police",
      policeData.address,
      policeData.police_id,
      policeData.badge_number,
      policeData.rank,
      policeData.station,
      policeData.joining_date,
      "pending", // Default status
    ];

    try {
      const [result] = await pool.execute(query, values);
      return result;
    } catch (err) {
      console.error("Database Error:", err.sqlMessage || err);
      throw err;
    }
  },
};

module.exports = RequestModel;
