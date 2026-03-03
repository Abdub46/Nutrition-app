// ================== IMPORTS ==================
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// Load environment variables
require("dotenv").config();


// ================== DATABASE ==================
const sequelize = require("./config/database");

// ================== MODELS ==================
const User = require("./models/User");
const BMIHistory = require("./models/BMIHistory");

// ================== ROUTES ==================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const healthRoutes = require("./routes/healthRoutes");
const aiRoute = require("./routes/aiSuggestions"); // AI Nutrition routes

// ================== APP INIT ==================
const app = express();

// ================== MIDDLEWARES ==================
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    credentials: true, // Allow cookies
  })
);

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json()); // Parse JSON requests
app.use(cookieParser());

// ================== ROUTES ==================
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/ai-suggestions", aiRoute);

// ================== DATABASE CONNECTION ==================
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ Database connection error:", err));

sequelize
  .sync({ alter: true })
  .then(() => console.log("✅ All models synced"))
  .catch((err) => console.error("❌ Sync error:", err));

// ================== ROOT ==================
app.get("/", (req, res) => {
  res.json({ message: "Horizon API Running 🚀" });
});

// ================== SERVER START ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});



