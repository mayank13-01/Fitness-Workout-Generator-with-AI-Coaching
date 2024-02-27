// Importing the GoogleGenerativeAI class from the "@google/generative-ai" package
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Importing dotenv for environment variable configuration
require("dotenv").config();

// Controller function for submitting a workout using Google Generative AI
exports.postSubmitWorkout = async (req, res, next) => {
  // Creating a new instance of GoogleGenerativeAI with the provided API key
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // Getting the "gemini-pro" generative model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // Extracting the prompt from the request body
  const prompt = req.body.prompt;

  try {
    // Generating content using the Google Generative AI model based on the provided prompt
    const result = await model.generateContent(prompt);

    // Extracting the response and text from the result
    const response = result.response;
    const text = response.text();

    // Returning the generated text in the response
    res.status(200).json({
      text: text,
    });
  } catch (err) {
    // Handling errors and passing them to the next middleware
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
