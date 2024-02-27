// Importing the JSON Web Token (JWT) library
const jwt = require("jsonwebtoken");

// Middleware function for checking user authentication using JWT
module.exports = (req, res, next) => {
  // Extracting the token from the "Authorization" header
  const token = req.get("Authorization").split(" ")[1];
  let decodedToken;

  try {
    // Verifying and decoding the JWT using a secret key ("veryverysecret")
    decodedToken = jwt.verify(token, "veryverysecret");
  } catch {
    // Handling errors in case of JWT verification failure
    const err = new Error("Internal Server Error");
    err.statusCode = 500;
    throw err;
  }

  // Checking if the decoded token is null (not authenticated)
  if (!decodedToken) {
    const error = new Error("Not Authenticated");
    error.statusCode = 401;
    throw error;
  }

  // Adding the userId from the decoded token to the request object for later use
  req.userId = decodedToken.userId;

  // Proceeding to the next middleware or route handler
  next();
};
