// Importing required dependencies
const express = require("express");

// Importing gemini controller
const geminiController = require("../controller/gemini");

// Creating an Express router
const router = express.Router();

// Route for submitting a workout
router.post("/submit-workout", geminiController.postSubmitWorkout);

// Exporting the router for use in other parts of the application
module.exports = router;
