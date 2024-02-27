// Importing necessary components and utilities from react-router-dom and other libraries
import { Form, useActionData, useNavigation, redirect } from "react-router-dom";
import { PulseSpinner } from "react-spinners-kit";
import { toast } from "react-toastify";

// Importing custom Input component
import Input from "../components/Input";

// Functional component for Signup page
export default function Signup() {
  // Using hooks to retrieve action data and navigation state
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // Rendering the Signup form
  return (
    <div className="flex justify-center items-center m-0 h-screen">
      <Form
        method="POST"
        className="p-16 bg-cream rounded-2xl shadow-lg text-center"
      >
        <h2 className="text-center mb-8 text-3xl text-brown">Signup</h2>

        {/* Displaying error or success message */}
        {data && data.message && (
          <p className="text-red text-xl py-2">{data.message}</p>
        )}

        {data && !data.message && (
          <p className="text-red text-xl py-2">{data}</p>
        )}

        {/* Input fields for user information */}
        <Input
          label="First Name"
          type="text"
          name="firstName"
          id="firstName"
          placeholder="Enter your first name"
        />

        <Input
          label="Last Name"
          type="text"
          name="lastName"
          id="lastName"
          placeholder="Enter your last name"
        />

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

        <Input
          label="Confirm Password"
          type="password"
          name="confirm_password"
          id="confirm_password"
          placeholder="Enter your password again"
        />

        {/* Reset and Submit buttons with loading spinner */}
        <p className="flex justify-end gap-4 mt-8">
          <button
            type="reset"
            className="py-2 px-4 text-xl rounded-md bg-transparent text-brown hover:text-beige"
          >
            Reset
          </button>

          <button
            type="submit"
            className="py-2 px-4 text-lg text-cream rounded-md bg-brown cursor-pointer transition-all hover:bg-beige hover:text-cream focus:bg-gray focus:outline-none disabled:opacity-50 disabled:bg-brown disabled:text-gray-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <PulseSpinner size={30} color="#EEEEEE" />
            ) : (
              "Signup"
            )}
          </button>
        </p>
      </Form>
    </div>
  );
}

// Action function for handling Signup form submission
export async function action({ request }) {
  // Extracting form data from the request
  const data = await request.formData();
  const authData = {
    firstName: data.get("firstName"),
    lastName: data.get("lastName"),
    email: data.get("email"),
    password: data.get("password"),
    confirm_password: data.get("confirm_password"),
  };

  // Checking if passwords match
  if (authData.password !== authData.confirm_password) {
    return "Passwords do not match.";
  }

  // Sending a request to the server for user signup
  const response = await fetch("http://localhost:8080/signup", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      firstName: authData.firstName,
      lastName: authData.lastName,
      email: authData.email,
      password: authData.password,
    }),
  });

  // Handling server response for validation errors
  if (response.status === 422 || response.status === 401) {
    const responseData = await response.json();
    if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
      const errorMessages = responseData.errors.map((error) => error.msg);
      const combinedErrorMessage = errorMessages.join(" ");
      return combinedErrorMessage;
    }
  }

  // Handling other server errors
  if (!response.ok) {
    throw json({ message: " Could not authenticate." }, { status: 500 });
  }

  // Displaying success toast and redirecting to login page
  toast.success("Signup successful.", {
    position: "top-center",
  });

  return redirect("/login");
}
