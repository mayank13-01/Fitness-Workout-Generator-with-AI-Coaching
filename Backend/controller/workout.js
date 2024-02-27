// Importing nodemailer library for sending emails
const nodemailer = require("nodemailer");

// Importing User model
const User = require("../models/user");

// Creating a nodemailer transport with Mailtrap credentials
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASS,
  },
});

// Controller function for sending workout details via email
exports.postWorkoutMail = async (req, res, next) => {
  try {
    // Finding the user in the database based on the userId from the request
    const user = await User.findOne({ _id: req.userId });
    const email = user.email;

    // Extracting workout details from the request body
    const workoutDetails = req.body.dataAI;

    // Sending an email with workout details using nodemailer
    await transport.sendMail({
      to: email,
      from: "mayank@project-nebula.com",
      subject: "Workout Details",
      html: `
        <html>
        <head>
            <style>
            
            p {
                white-space: pre-wrap;
            }
            </style>
        </head>
        <body>
            <h1>Your workout details are </h1>
            <p>${workoutDetails}</p>
        </body>
        </html>
    `,
    });

    // Returning a success response
    res.status(200).json({ message: "Workout details sent successfully!" });
  } catch (err) {
    // Handling errors and passing them to the next middleware
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ user: user });
  } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
