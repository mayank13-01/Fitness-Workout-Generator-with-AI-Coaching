// Importing required components from react-router-dom
import { Form, NavLink, useRouteLoaderData } from "react-router-dom";

// Functional component for the main navigation
export default function MainNavigation() {
  // Using useRouteLoaderData hook to get the token from the root route
  const token = useRouteLoaderData("root");

  // The component returns a header containing the application name and navigation links/buttons
  return (
    <header className="flex justify-between p-4 bg-cream">
      {/* Application name linked to the home page */}
      <div>
        <NavLink to="/">
          <h2 className="text-3xl text-brown font-bold">
            🏋️‍♂️ Workout Generator
          </h2>
        </NavLink>
      </div>

      {/* Navigation links/buttons based on the presence of a token */}
      <div className="flex gap-5">
        {/* If no token exists, display Login and Signup buttons */}
        {!token && (
          <>
            <div>
              {/* Login button */}
              <button className="py-2 px-4 text-xl rounded-md bg-transparent text-brown hover:text-beige">
                <NavLink to="/login">Login</NavLink>
              </button>
            </div>
            <div>
              {/* Signup button */}
              <button className="py-2 px-4 text-xl rounded-md bg-brown text-cream cursor-pointer transition-all hover:bg-beige hover:text-cream focus:bg-beige focus:outline-none">
                <NavLink to="/signup">Signup</NavLink>
              </button>
            </div>
          </>
        )}

        {/* If a token exists, display Logout button */}
        {token && (
          <>
            <div>
              {/* User */}
              <button className="py-2 px-4 text-xl rounded-md bg-transparent text-brown hover:text-beige">
                <NavLink
                  to="/user"
                  className={({ isActive }) => (isActive ? "underline" : "")}
                >
                  Hello, {localStorage.getItem("name")}
                </NavLink>
              </button>
            </div>
            <Form action="logout" method="POST">
              {/* Logout button */}
              <button className="py-2 px-4 text-xl rounded-md bg-brown text-cream cursor-pointer transition-all hover:bg-beige hover:text-cream focus:bg-beige focus:outline-none">
                Logout
              </button>
            </Form>
          </>
        )}
      </div>
    </header>
  );
}
