// Importing necessary React hooks and components from react-router-dom and other libraries
import {
  Form,
  redirect,
  useActionData,
  useNavigation,
  NavLink,
} from "react-router-dom";
import { PulseSpinner } from "react-spinners-kit";
import { toast } from "react-toastify";

// Importing custom Input component
import Input from "../components/Input";

// Functional component for the Login page
export default function Login() {
  // Using hooks to retrieve action data and navigation state
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // Rendering the Login form
  return (
    <>
      <div className="flex justify-center items-center m-0 h-screen">
        <Form
          method="POST"
          className="p-16 bg-cream rounded-2xl shadow-2xl  text-center"
        >
          <h2 className="text-center mb-8 text-3xl text-brown">Login</h2>
          {/* Displaying error message if present */}
          {data && data.message && (
            <p className="text-red text-xl py-2">{data.message}</p>
          )}

          {/* Input fields for user login */}
          <Input
            label="Email"
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
          />

          {/* Reset and Submit buttons with loading spinner */}
          <p className="flex justify-end gap-2 mt-8">
            <button className="py-2 px-4 text-md underline rounded-md bg-transparent text-brown hover:text-beige">
              <NavLink to="/reset">Forgot Password ?</NavLink>
            </button>

            <button
              type="submit"
              className="py-2 px-4 text-lg text-cream rounded-md bg-brown cursor-pointer transition-all hover:bg-beige hover:text-cream focus:bg-gray focus:outline-none disabled:opacity-50 disabled:bg-brown disabled:text-gray-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <PulseSpinner size={30} color="#EEEEEE" />
              ) : (
                "Login"
              )}
            </button>
          </p>
        </Form>
      </div>
    </>
  );
}

// Action function for handling login form submission
export async function action({ request }) {
  // Extracting form data from the request
  const data = await request.formData();
  const authData = {
    email: data.get("email"),
    password: data.get("password"),
  };

  // Sending a request to the server for user login
  const response = await fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  // Handling server response for validation errors
  if (response.status === 422 || response.status === 401) {
    return response;
  }

  // Handling other server errors
  if (!response.ok) {
    throw json({ message: " Could not authenticate." }, { status: 500 });
  }

  // Extracting token from server response and storing it in local storage
  const resData = await response.json();
  const token = resData.token;
  localStorage.setItem("token", token);

  // Setting expiration time for the token in local storage
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);
  localStorage.setItem("expire", expiration.toISOString());

  const firstName = resData.firstName;
  localStorage.setItem("name", firstName);

  // Displaying success toast and redirecting to the home page
  toast.success("Login successful.", {
    position: "top-center",
  });
  return redirect("/");
}
