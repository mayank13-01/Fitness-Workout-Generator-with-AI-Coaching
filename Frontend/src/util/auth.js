// Import the 'redirect' function from the 'react-router-dom' library
import { redirect } from "react-router-dom";

// Function to calculate the remaining duration of the authentication token
export function getTokenDuration() {
  // Retrieve the token expiration timestamp from local storage
  const expireStored = localStorage.getItem("expire");

  // If no expiration timestamp is stored, return 0
  if (!expireStored) {
    return 0;
  }

  // Parse the expiration timestamp and calculate the remaining duration
  const expire = new Date(expireStored);
  const now = new Date();
  const duration = expire.getTime() - now.getTime();

  return duration;
}

// Function to retrieve the authentication token from local storage
export function getAuthToken() {
  // Retrieve the authentication token from local storage
  const token = localStorage.getItem("token");

  // If no token is stored, return null
  if (!token) {
    return null;
  }

  // Calculate the remaining duration of the token
  const duration = getTokenDuration();

  // If the token has expired, return "EXPIRED"; otherwise, return the token
  if (duration < 0) {
    return "EXPIRED";
  }
  return token;
}

// Function to load the authentication token
export function tokenLoader() {
  // Call the 'getAuthToken' function to retrieve the token
  return getAuthToken();
}

// Function to check the authentication token and redirect if present
export function checkAuthToken() {
  // Retrieve the authentication token
  const token = getAuthToken();

  // If a token is present, redirect to the home page ("/")
  if (token) {
    return redirect("/");
  }

  // If no token is present, return null
  return null;
}
