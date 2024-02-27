// Importing the redirect function from react-router-dom
import { redirect } from "react-router-dom";

// Action function for handling logout
export function action() {
  // Removing token and expiration data from local storage
  localStorage.removeItem("token");
  localStorage.removeItem("expire");
  localStorage.removeItem("name");

  // Redirecting to the home page
  return redirect("/");
}
