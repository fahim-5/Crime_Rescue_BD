const db = require("../config/db");

const createUser = (full_name, username, email, national_id, passport, mobile, address, password, role, callback) => {
  // Convert the role to lowercase
  const lowerCaseRole = role.toLowerCase();

  const query = "INSERT INTO users (full_name, username, email, national_id, passport, mobile_no, address, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  
  db.query(query, [full_name, username, email, national_id, passport || null, mobile, address, password, lowerCaseRole], (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

module.exports = { createUser };
