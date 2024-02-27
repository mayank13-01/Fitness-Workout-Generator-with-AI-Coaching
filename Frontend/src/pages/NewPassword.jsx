// Importing necessary React hooks and components from react-router-dom
import { Form, redirect, useParams, useActionData } from "react-router-dom";
import { toast } from "react-toastify";

// Functional component for setting a new password
export default function NewPassword() {
  // Extracting token ID from route parameters
  const { tokenId } = useParams();
  const data = useActionData();

  return (
    <div>
      <Form method="POST">
        {data && data.message && (
          <p className="text-red text-xl py-2 text-center mt-4">
            {data.message}
          </p>
        )}
        <div className="flex justify-center items-center text-lg  mt-12 mb-4 gap-5">
          <label>Password</label>
          <input
            type="password"
            name="password"
            id="password"
            required
            placeholder="Enter your new password"
            className="p-3 rounded-lg bg-gray-300 shadow-2xl transition duration-300 text-brown w-80 disabled:opacity-50 disabled:text-gray-500"
          />
        </div>
        <input type="hidden" name="tokenId" id="tokenId" value={tokenId} />
        <div className="flex justify-center mt-4">
          <button
            className="py-2 px-4 text-lg text-brown rounded-md bg-cream cursor-pointer transition-all hover:bg-beige hover:text-cream focus:bg-gray focus:outline-none disabled:opacity-50 disabled:bg-brown disabled:text-gray-500"
            type="submit"
          >
            Save new password
          </button>
        </div>
      </Form>
    </div>
  );
}

// Action function for handling new password submission
export async function action({ request }) {
  const data = await request.formData();
  const password = data.get("password");
  const tokenId = data.get("tokenId");

  const response = await fetch("http://localhost:8080/new-password", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ password: password, tokenId: tokenId }),
  });

  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    throw json(
      { message: " There was an error while changing password." },
      { status: 500 }
    );
  }

  console.log(response);

  // Displaying success toast and redirecting to the login page
  toast.success("Password changed successfully.", {
    position: "top-center",
  });
  return redirect("/");
}
