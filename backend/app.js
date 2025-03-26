const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");



const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const requestRoutes=require("./routes/requestRoutes")



const errorMiddleware = require("./middlewares/errorMiddleware");
const upload = require("./middlewares/upload"); 
const verificationRoutes = require("./routes/verificationRoutes");


dotenv.config();
const app = express();



app.use(errorMiddleware);
app.use(express.json()); // JSON body parser
app.use(cors({ origin: "http://localhost:5173", credentials: true }));  // CORS for frontend
app.use(morgan("dev")); // Logging requests
app.use("/uploads", express.static("uploads"));  // Static file serving for uploaded files
app.use("/api/verification", verificationRoutes);






// Routes
app.use("/public-admin/", authRoutes);   // Authentication routes
app.use("/api/reports", reportRoutes);  // Crime report routes (upload middleware is applied in reportRoutes.js)
app.use("/police/",requestRoutes)



module.exports = app;
