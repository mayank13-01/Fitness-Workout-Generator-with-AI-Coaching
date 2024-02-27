// Importing required dependencies
const express = require("express");

// Importing workout controller and authentication middleware
const workoutController = require("../controller/workout");
const isAuth = require("../middleware/is-auth");

// Creating an Express router
const router = express.Router();

// Route for getting user details, protected by authentication middleware
router.get("/user", isAuth, workoutController.getUser);

// Route for posting workout mail, protected by authentication middleware
router.post("/workout-mail", isAuth, workoutController.postWorkoutMail);

// Exporting the router for use in other parts of the application
module.exports = router;
