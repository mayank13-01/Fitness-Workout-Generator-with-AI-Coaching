// Importing required dependencies
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

// Importing route modules
const authRoutes = require("./routes/auth");
const geminiRoutes = require("./routes/gemini");
const workoutRoutes = require("./routes/workout");

// Creating an Express application
const app = express();

// Middleware: Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Middleware: Parse incoming JSON data
app.use(bodyParser.json());

// Middleware: Set up CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Define routes for different parts of the application
app.use("/", authRoutes);
app.use("/", geminiRoutes);
app.use("/", workoutRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  const statusCode = error.statusCode || 500;
  const message = error.message;
  res.status(statusCode).json({
    message: message,
  });
});

// Connect to MongoDB using the provided API key
mongoose
  .connect(process.env.MONGO_API_KEY)
  .then((result) => {
    // Start the server once connected to MongoDB
    const server = app.listen(8080, () => {
      console.log("Server is running on port 8080");
    });
  })
  .catch((err) => console.log(err));
