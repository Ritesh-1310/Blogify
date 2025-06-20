require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const userRoutes = require("./routes/api/user");
const blogRoutes = require("./routes/api/blog");

const app = express();
const PORT = process.env.PORT || 8000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// CORS setup for React frontend
app.use(cors({
  origin: "https://blogify-frontend-teal.vercel.app", 
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/blog", blogRoutes);

// 404 Fallback
app.use("*", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

