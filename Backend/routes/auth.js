// Importing required dependencies
const express = require("express");
const { body } = require("express-validator");

// Importing authentication controller and user model
const authController = require("../controller/auth");
const User = require("../models/user");

// Creating an Express router
const router = express.Router();

// Route for user signup
router.post(
  "/signup",
  [
    // Validation for email field
    body("email")
      .isEmail()
      .trim()
      .custom((value, { req }) => {
        // Check if the email already exists in the database
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email already exists.");
          }
        });
      }),
    // Validation for password field
    body("password").isStrongPassword().withMessage("Password is not strong."),
  ],
  // Handling the signup logic in the authController
  authController.postSignup
);

// Route for user login
router.post("/login", authController.postLogin);

// Route for resetting password
router.post("/reset-password", authController.postReset);

// Route for setting a new password after resetting
router.post("/new-password", authController.postNewPassword);

// Exporting the router for use in other parts of the application
module.exports = router;
