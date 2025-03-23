const db = require("../config/db");

const createUser = (full_name, username, email, national_id, passport, mobile, password, role, callback) => {
  const query = "INSERT INTO users (full_name, username, email, national_id, passport, mobile, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  
  db.query(query, [full_name, username, email, national_id, passport || null, mobile, password, role], (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

module.exports = { createUser };


