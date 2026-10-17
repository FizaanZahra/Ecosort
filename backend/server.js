require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes
const userRoutes = require("./routes/userRoutes");
const wasteRoutes = require("./routes/wasteRoutes");
const binRoutes = require("./routes/binRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const rewardRoutes = require("./routes/rewardRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
  })
);
app.use(express.json());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/waste", wasteRoutes);
app.use("/api/bins", binRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rewards", rewardRoutes);

// Health check endpoints
app.get("/", (req, res) => {
  res.json({
    name: "EcoSort Smart Waste Management API",
    version: "1.0.0",
    status: "online",
    message: "EcoSort Backend is running!"
  });
});

app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "EcoSort API is working!" });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// Centralized error handling
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err.message);
  res.status(500).json({
    message: "An internal server error occurred.",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`EcoSort backend running on http://localhost:${PORT}`);
});