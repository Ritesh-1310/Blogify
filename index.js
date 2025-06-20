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

// CORS setup
// Allow both production and local dev frontend
const allowedOrigins = [
  "https://blogify-frontend-teal.vercel.app",
  "http://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Important for cookies/auth
}));


// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/blog", blogRoutes);

// API base route
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Blogify API is working!",
    docs: "API documentation will be available soon.",
  });
});

app.get("/api", (req, res) => {
  return res.status(200).json({
    message: "Blogify API is working!",
    docs: "API documentation will be available soon.",
  });
});

// 404 Fallback
app.use("*", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

