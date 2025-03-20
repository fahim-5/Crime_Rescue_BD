const errorMiddleware = (err, req, res, next) => {
    console.error("🔥 Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  };
  
  module.exports = errorMiddleware;
  