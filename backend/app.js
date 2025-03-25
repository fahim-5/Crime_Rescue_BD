const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");  // Import the routes for crime reports
const errorMiddleware = require("./middlewares/errorMiddleware");
const upload = require("./middlewares/upload"); 
const verificationRoutes = require("./routes/verificationRoutes");


// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();

// Middleware
app.use(express.json()); // JSON body parser
app.use(cors({ origin: "http://localhost:5173", credentials: true }));  // CORS for frontend
app.use(morgan("dev")); // Logging requests
app.use("/uploads", express.static("uploads"));  // Static file serving for uploaded files




app.use("/api/verification", verificationRoutes);


// Routes
app.use("/public-admin/", authRoutes);   // Authentication routes
app.use("/api/reports", reportRoutes);  // Crime report routes (upload middleware is applied in reportRoutes.js)

// Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
