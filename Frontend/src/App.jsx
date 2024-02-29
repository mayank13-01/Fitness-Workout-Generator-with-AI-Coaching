// Importing necessary modules from react-router-dom
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Importing components and actions
import RootLayout from "./pages/Root";
import Error from "./pages/Error";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import User from "./pages/User";
import Reset from "./pages/Reset";
import NewPassword from "./pages/NewPassword";

// Importing utility functions related to authentication
import { tokenLoader } from "./util/auth";
import { checkAuthToken } from "./util/auth";
import { action as homeAction } from "./pages/Home";
import { action as loginAction } from "./pages/Login";
import { action as signupAction } from "./pages/Signup";
import { action as logoutAction } from "./pages/Logout";
import { action as resetAction } from "./pages/Reset";
import { action as newPasswordAction } from "./pages/NewPassword";

// Creating a browser router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // RootLayout component rendered for the root path
    errorElement: <Error />, // Error component rendered for any errors
    id: "root",
    loader: tokenLoader, // Loader function to load authentication token
    // Nested routes for the root path
    children: [
      { index: true, element: <Home />, action: homeAction }, // Home page as the default index
      {
        path: "login",
        element: <Login />,
        loader: checkAuthToken, // Loader function to check authentication token for the login route
        action: loginAction, // Action associated with the login route
      },
      {
        path: "signup",
        element: <Signup />,
        loader: checkAuthToken, // Loader function to check authentication token for the signup route
        action: signupAction, // Action associated with the signup route
      },
      {
        path: "user",
        element: <User />,
      },
      {
        path: "reset",
        children: [
          {
            index: true,
            element: <Reset />,
            action: resetAction, // Action associated with the reset route
          },
          {
            path: ":tokenId",
            element: <NewPassword />,
            action: newPasswordAction, // Action associated with the newPassword route
          },
        ],
      },
      {
        path: "logout",
        action: logoutAction, // Action associated with the logout route
      },
    ],
  },
]);

// Main component rendering the RouterProvider with the created router
export default function App() {
  return <RouterProvider router={router} />;
}
