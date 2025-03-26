const bcrypt = require("bcryptjs");
const RequestModel = require("../models/requestModel");

const requestController = {
  registerUser: async (req, res) => {
    try {
      const {
        full_name,
        username,
        email,
        national_id,
        passport,
        mobile,
        password,
        confirmPassword,
        address,
        police_id,
        badge_number,
        rank,
        station,
        joining_date,
      } = req.body;

      if (
        !full_name || !username || !email || !national_id || !mobile || !password ||
        !confirmPassword || !address || !police_id || !badge_number || !rank || !station || !joining_date
      ) {
        return res.status(400).json({ message: "All fields are required." });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
      }

      // Validate Address Format (District-Thana)
      const addressPattern = /^[a-zA-Z\s]+-[a-zA-Z\s]+$/;
      if (!addressPattern.test(address)) {
        return res.status(400).json({
          message: "Enter a valid address in the format: District-Thana (e.g., Dhaka-Mirpur).",
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      // Save police request in the database
      const policeData = {
        full_name, username, email, national_id, passport, mobile, password_hash,
        address, police_id, badge_number, rank, station, joining_date
      };

      await RequestModel.createPoliceRequest(policeData);

      res.status(201).json({ message: "Police signup request submitted successfully." });

    } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ message: "Server error during signup." });
    }
  },


getAllPoliceRequests: async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const requests = status 
      ? await RequestModel.getPoliceRequestsByStatus(status)
      : await RequestModel.getAllPoliceRequests();

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedRequests = requests.slice(startIndex, endIndex);

    res.status(200).json(paginatedRequests);

  } catch (error) {
    console.error('Error in getAllPoliceRequests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve police requests',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

}

module.exports = requestController;


