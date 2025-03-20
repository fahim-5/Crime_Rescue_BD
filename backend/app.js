const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();

// Middleware
app.use(express.json()); // JSON body parser
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(morgan("dev")); // Logging requests

// Routes
app.use("/api/auth", authRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
