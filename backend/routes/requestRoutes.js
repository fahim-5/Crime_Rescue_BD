const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const requestController = require("../controllers/requestController");
const validateRequest = require("../middlewares/validateRequest");

router.post(
  "/requests",
  [
    body("full_name").trim().notEmpty().withMessage("Full name is required"),
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    // Add other validations as needed
  ],
  validateRequest,
  requestController.registerUser
);

router.get("/requests", requestController.getAllPoliceRequests)


module.exports = router;