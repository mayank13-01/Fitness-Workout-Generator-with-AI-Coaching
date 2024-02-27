// Importing required dependencies
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { promisify } = require("util");

// Importing the User model
const User = require("../models/user");
const randomBytesAsync = promisify(crypto.randomBytes);

// Creating a nodemailer transport with Mailtrap credentials
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "468a0bc8af13a5",
    pass: "a57d64add03d50",
  },
});

// Controller function for user signup
exports.postSignup = async (req, res, next) => {
  // Validation of incoming request data using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }

  // Extracting user information from the request body
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  try {
    // Hashing the user's password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 12);

    // Creating a new user object with hashed password
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    });

    // Saving the user to the database
    const result = await user.save();

    // Sending a signup success email using nodemailer
    const sendMail = await transport.sendMail({
      to: email,
      from: "mayank@project-nebula.com",
      subject: "Signup Succeeded",
      html: "<h1>You Successfully Signed Up</h1>",
    });

    // Returning a success response
    res.status(201).json({
      message: "User created.",
      userId: result._id,
    });
  } catch (err) {
    // Handling errors and passing them to the next middleware
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Controller function for user login
exports.postLogin = async (req, res, next) => {
  // Extracting user login credentials from the request body
  const email = req.body.email;
  const password = req.body.password;

  try {
    // Finding the user in the database based on the provided email
    const user = await User.findOne({ email: email });
    if (!user) {
      // Handling the case when the email is not found
      const error = new Error("Email not found.");
      error.statusCode = 401;
      throw error;
    }

    const firstName = user.firstName;

    // Comparing the provided password with the hashed password stored in the database
    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      // Handling the case when the password is incorrect
      const error = new Error("Wrong password.");
      error.statusCode = 401;
      throw error;
    }

    // Generating a JWT token for the authenticated user
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      "veryverysecret",
      { expiresIn: "1h" }
    );

    // Returning the token and user ID in the response
    res.status(200).json({
      token: token,
      firstName: firstName,
      userId: user._id.toString(),
    });
  } catch (err) {
    // Handling errors and passing them to the next middleware
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Controller function for initiating password reset
exports.postReset = async (req, res, next) => {
  try {
    // Generate a random token for password reset
    const buffer = await randomBytesAsync(32);
    const token = buffer.toString("hex");

    // Find user by email
    const user = await User.findOne({ email: req.body.email });

    // If no user found, return an error
    if (!user) {
      const error = new Error("No user found.");
      error.statusCode = 401;
      throw error;
    }

    // Set the reset token and its expiration time for the user
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour

    // Save the user with the updated reset information
    await user.save();

    // Send an email with a password reset link
    transport.sendMail({
      to: req.body.email,
      from: "mayank@project-nebula.com",
      subject: "Reset Password",
      html: `
      <p>Password Reset Link</p>
      <p>Click on the <a href="http://localhost:5173/reset/${token}">link</a> to reset the Password</p>
      `,
    });

    // Return success message
    res.status(200).json({ message: "Reset token generated successfully." });
  } catch (err) {
    // Handle errors and pass them to the next middleware
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Controller function for setting a new password after reset
exports.postNewPassword = async (req, res, next) => {
  const newPassword = req.body.password;
  const tokenId = req.body.tokenId;

  try {
    // Find a user with a valid reset token and not expired
    const user = await User.findOne({
      resetToken: tokenId,
      resetTokenExpiration: { $gt: Date.now() },
    });

    // If no user found or token is expired, return an error
    if (!user) {
      const error = new Error("Invalid or expired reset token.");
      error.statusCode = 400;
      throw error;
    }

    // Check if the new password is different from the old one
    const isPasswordValid = await bcrypt.compare(newPassword, user.password);
    if (isPasswordValid) {
      const error = new Error(
        "New password must be different from the old password."
      );
      error.statusCode = 400;
      throw error;
    }

    // Hash the new password and update the user's password and reset token information
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = undefined;

    // Save the user with the updated password and reset information
    await user.save();

    // Return success message
    res.status(200).json({ message: "Password changed successfully." });
  } catch (err) {
    // Handle errors and pass them to the next middleware
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
