// Importing necessary React hooks and components from react-router-dom
import { useEffect } from "react";
import { Outlet, useLoaderData, useSubmit } from "react-router-dom";

// Importing utility function for token duration
import { getTokenDuration } from "../util/auth";

// Importing the MainNavigation component
import MainNavigation from "../components/MainNavigation";

// Functional component for the root layout
export default function RootLayout() {
  // Retrieving token data and submit function using hooks
  const token = useLoaderData();
  const submit = useSubmit();

  // Effect hook to handle logout when token changes
  useEffect(() => {
    // If no token is present, return
    if (!token) {
      return;
    }

    // Function to handle logout based on token expiration
    const handleLogout = async () => {
      try {
        // Logout immediately if token is "EXPIRED"
        if (token === "EXPIRED") {
          submit(null, { action: "/logout", method: "POST" });
        }

        // Get token duration and schedule logout after that duration
        const tokenDuration = getTokenDuration();

        setTimeout(async () => {
          submit(null, { action: "/logout", method: "POST" });
        }, tokenDuration);
      } catch (err) {
        console.error("Error during logout:", err);
      }
    };

    // Call the handleLogout function
    handleLogout();

    // Cleanup: no dependencies to watch for changes
  }, [token, submit]);

  // Rendering the MainNavigation component and nested routes
  return (
    <>
      <MainNavigation />
      <main>
        <Outlet />
      </main>
    </>
  );
}
