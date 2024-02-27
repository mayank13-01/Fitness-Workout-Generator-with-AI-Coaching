// Import necessary dependencies from React and other libraries
import { useRouteLoaderData, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Input from "../components/Input";

// Define the User component
export default function User() {
  // State variables to manage component state
  const [prompt, setPrompt] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  const [notificationTime, setNotificationTime] = useState("");
  const token = useRouteLoaderData("root");

  // useEffect hook to fetch user details when the component mounts or when the token changes
  useEffect(() => {
    async function loader() {
      setUserDetails([]);
      try {
        // Fetch user details from the server
        const response = await fetch("http://localhost:8080/user", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        // Handle HTTP errors
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse and set user details in the state
        const responseData = await response.json();
        setUserDetails(responseData.user);
      } catch (err) {
        // Handle errors during data retrieval
        console.error("Error occurred while retrieving data:", err);
        toast.error("Error occurred while retrieving data.", {
          position: "top-center",
        });
      }
    }
    // Invoke the loader function
    loader();
  }, [token, setUserDetails]);

  // Event handler for form submission to set notification time
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Display a success toast with the selected notification time
    toast.success(`Notification time set to ${notificationTime}`, {
      position: "top-center",
    });
    // Hide the notification prompt
    setPrompt(false);

    // Prepare options for the notification
    const options = {
      body: "Time for your daily workout!",
    };

    // Extract hours and minutes from the selected notification time
    const [hours, minutes] = notificationTime.split(":");
    const notificationDate = new Date();
    notificationDate.setHours(parseInt(hours, 10));
    notificationDate.setMinutes(parseInt(minutes, 10));

    // Check for Notification permission and schedule the notification
    if (Notification.permission === "granted") {
      setTimeout(() => {
        new Notification("Daily Workout Reminder", options);
      }, notificationDate.getTime() - Date.now());
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setTimeout(() => {
            new Notification("Daily Workout Reminder", options);
          }, notificationDate.getTime() - Date.now());
        }
      });
    }
  };

  // Render the User component
  return (
    <div
      className={`flex justify-center items-start m-12 h-screen ${
        prompt ? "fadeIn" : ""
      }`}
    >
      <div className={`bg-white rounded-lg p-8 ${prompt ? "fadeIn" : ""}`}>
        {/* Display user details */}
        <Input
          label="Name"
          type="text"
          name="email"
          id="email"
          disabled
          value={userDetails.firstName + " " + userDetails.lastName}
        />
        <Input
          label="Email"
          type="text"
          name="email"
          id="email"
          disabled
          value={userDetails.email}
        />

        {/* Prompt to enable notifications */}
        <p className="text-brown mt-12 text-lg">
          Want to receive notifications for your workout?
        </p>

        {/* Button to toggle notification prompt */}
        <button
          onClick={() => setPrompt((prevState) => !prevState)}
          disabled={prompt}
          className="mt-2 py-2 px-4 text-lg text-cream rounded-md bg-brown cursor-pointer transition-all hover:bg-beige hover:text-cream focus:outline-none disabled:opacity-50 disabled:bg-brown disabled:text-gray-500"
        >
          Click here
        </button>
        <button className="py-2 px-4 text-md underline rounded-md bg-transparent text-brown hover:text-beige">
          <NavLink to="/reset">Change Password </NavLink>
        </button>

        {/* Notification prompt form */}
        {prompt && (
          <div className="mt-8">
            <p className="text-brown text-lg mb-2">
              Set the time to receive daily notifications:
            </p>
            {/* Form to input and save notification time */}
            <form onSubmit={handleFormSubmit}>
              <Input
                label="Notification Time"
                type="time"
                name="notificationTime"
                id="notificationTime"
                value={notificationTime}
                onChange={(e) => setNotificationTime(e.target.value)}
              />
              {/* Button to save notification time */}
              <button
                type="submit"
                className="mt-2 py-2 px-4 text-lg text-cream rounded-md bg-brown cursor-pointer transition-all hover:bg-beige hover:text-cream focus:outline-none disabled:opacity-50 disabled:bg-brown disabled:text-gray-500"
              >
                Save
              </button>
              {/* Button to cancel notification prompt */}
              <button
                onClick={() => setPrompt((prevState) => !prevState)}
                className="py-2 px-4 text-xl rounded-md bg-transparent text-brown hover:text-beige"
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
