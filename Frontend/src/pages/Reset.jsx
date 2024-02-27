// Importing necessary modules from react-router-dom and toast library
import { Form, redirect, useActionData } from "react-router-dom";
import { toast } from "react-toastify";

// Functional component for the Reset Password page
export default function Reset() {
  // Using hook to retrieve action data
  const data = useActionData();

  // Rendering the Reset Password form
  return (
    <Form method="POST">
      {data && data.message && (
        <p className="text-red text-xl py-2 text-center mt-4">{data.message}</p>
      )}
      <div className="flex justify-center items-center text-lg  mt-8 mb-4 gap-5">
        <label>Email</label>
        <input
          type="email"
          name="email"
          id="email"
          required
          placeholder="Enter your email"
          className="p-3 rounded-lg bg-gray-300 shadow-2xl transition duration-300 text-brown w-80 disabled:opacity-50 disabled:text-gray-500"
        />
      </div>
      <div className="flex justify-center mt-4">
        <button
          className="py-2 px-4 text-lg text-brown rounded-md bg-cream cursor-pointer transition-all hover:bg-beige hover:text-cream  focus:outline-none disabled:opacity-50 disabled:bg-brown disabled:text-gray-500"
          type="submit"
        >
          Reset Password
        </button>
      </div>
    </Form>
  );
}

// Action function for handling password reset form submission
export async function action({ request }) {
  // Extracting form data from the request
  const data = await request.formData();
  const email = data.get("email");

  // Sending a request to the server for password reset
  const response = await fetch("http://localhost:8080/reset-password", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ email: email }),
  });

  // Handling server response for validation errors
  if (response.status === 422 || response.status === 401) {
    return response;
  }

  // Handling other server errors
  if (!response.ok) {
    throw json(
      { message: " There was an error while sending mail." },
      { status: 500 }
    );
  }

  // Displaying success toast and redirecting to the login page
  toast.success("Reset mail sent successfully.", {
    position: "top-center",
  });
  return redirect("/login");
}
