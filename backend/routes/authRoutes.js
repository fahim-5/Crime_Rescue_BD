const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", registerUser); // Handle user registration
router.post("/login", loginUser); // Handle user login

module.exports = router;
