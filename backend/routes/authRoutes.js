const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const validateRequest = require("../middlewares/validateRequest");

router.post(
  "/signup",
  [
    body("full_name").trim().notEmpty().withMessage("Full name is required"),
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  ],
  validateRequest,
  authController.registerUser
);



router.post("/login", 
  [
    body("email").isEmail().normalizeEmail(),
    body("password").exists(),
    body("role").isIn(["public", "police", "admin"])
  ],
  validateRequest,
  authController.loginUser
);



router.post("/login", authController.loginUser);

module.exports = router;