// Importing Mongoose library
const mongoose = require("mongoose");

// Creating a Mongoose Schema
const Schema = mongoose.Schema;

// Defining the User Schema with required fields (email, password, firstName, lastName)
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiration: {
    type: Date,
  },
});

// Creating and exporting the User model based on the User Schema
module.exports = mongoose.model("User", userSchema);
