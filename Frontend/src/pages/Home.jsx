// Importing necessary React hooks and components from react-router-dom and other libraries
import { useState, useRef, useEffect } from "react";
import { useRouteLoaderData } from "react-router-dom";
import { PulseSpinner } from "react-spinners-kit";
import { toast } from "react-toastify";

// Importing Modal component and workout-related data
import Modal from "../components/Modal";
import { goals, often, types, levels } from "../data";

// Functional component for the Home page
export default function Home() {
  // State variables for slider value, workout data, modal visibility, and email status
  const [sliderValue, setSliderValue] = useState(28);
  const [dataAI, setDataAI] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Retrieving token from route loader data
  const token = useRouteLoaderData("root");

  const dataRef = useRef();

  // Event handler for slider value change
  function sliderChange(event) {
    setSliderValue(event.target.value);
  }

  // Asynchronous function to handle receiving workout details via email
  async function handleReceive() {
    setEmailSent(true);
    try {
      // Checking user authorization
      if (!token) {
        throw new Error("User not authorized.");
      }

      // Sending a request to the server to send workout details via email
      const response = await fetch("http://localhost:8080/workout-mail", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ dataAI: dataAI }),
      });

      // Handling server response
      if (!response.ok) {
        throw new Error(
          `Failed to send workout mail. Status: ${response.status}`
        );
      }

      // Displaying success toast on successful email sending
      const resData = await response.json();
      setEmailSent(false);
      toast.success(resData.message, {
        position: "top-center",
      });
    } catch (err) {
      // Handling errors during email sending
      console.error("Failed to send email:", err);
      toast.error("Failed to send email. Please try again.", {
        position: "top-center",
      });
    }
  }

  // Asynchronous function to handle form submission for generating workout
  async function handleSubmit(event) {
    event.preventDefault();

    // Creating FormData object from the form
    const fd = new FormData(event.target);
    const acquisitionChannel = fd.getAll("acquisition");
    const data = Object.fromEntries(fd.entries());
    data.acquisition = acquisitionChannel;

    setDataAI("");
    try {
      // Opening the modal before fetching the workout data
      setOpenModal(true);
      const prompt = `Generate a detailed workout with description for a ${
        data.level
      } level with the goal to ${data.goal.toLowerCase()}, focusing on ${data.type.toLowerCase()} workouts, ${data.often.toLowerCase()} and covering ${sliderValue} days. Gender: ${
        data.gender
      }, Age: ${data.age}, Current Weight: ${
        data["current-weight"]
      } kg, Target Weight: ${data["target-weight"]} kg.`;

      // Fetching workout data from the server
      const response = await fetch("http://localhost:8080/submit-workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      // Handling server response for workout data
      if (!response.ok) {
        throw new Error("Oops, there was an error while retrieving the data.");
      }

      // Displaying generated workout data
      const resData = await response.json();
      const text = resData.text;
      setDataAI(text);
    } catch (err) {
      // Handling errors during workout generation
      console.error("Error during workout generation:", err);
      toast.error("Failed to generate workout. Please try again.", {
        position: "top-center",
      });
    }
    // Closing the modal after fetching the workout data
    setOpenModal(false);
  }

  useEffect(() => {
    if (dataAI) {
      dataRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [dataAI]);

  // Rendering the Home component UI
  return (
    <div>
      {/* Rendering the Modal component */}
      <Modal open={openModal} />

      {/* Rendering button to receive workout details via email */}
      {dataAI && token && (
        <div className="text-center">
          <p className="mt-4 text-xl">
            Tap to receive your personalized workout plan via email. We'll send
            the details directly to your inbox for quick access.
          </p>
          <button
            type="submit"
            className="mt-4 py-2 px-4 text-lg text-cream rounded-md bg-brown cursor-pointer transition-all hover:bg-beige hover:text-cream  focus:outline-none disabled:opacity-50 disabled:bg-brown disabled:text-gray-500"
            onClick={handleReceive}
          >
            {emailSent ? (
              <PulseSpinner size={60} color="#EEEEEE" />
            ) : (
              "Click here"
            )}
          </button>
        </div>
      )}

      {/* Rendering the workout form */}
      <form className="text-center mx-auto mt-20" onSubmit={handleSubmit}>
        {/* Form inputs for workout generation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 m-8">
          {/* Fitness level selection */}
          <div className="mb-8">
            <p className="mb-6 text-lg">🎖️ What is your fitness level ?</p>
            <div className="radio-inputs">
              {levels.map((level, index) => {
                return (
                  <label className="radio" key={index}>
                    <input
                      type="radio"
                      name="level"
                      id="level"
                      value={level.value}
                      required
                    />
                    <span className="name">{level.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Fitness goal selection */}
          <div className="mb-8">
            <p className="mb-6 text-lg">🎯 What is your fitness goal ?</p>
            <select
              name="goal"
              id="goal"
              required
              className="text-brown p-3 w-40 text-left rounded-lg bg-gray-300 shadow-2xl transition duration-300"
            >
              <option value="">Select Goal</option>
              {goals.map((goal, index) => {
                return (
                  <option value={goal.value} key={index}>
                    {goal.label}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Gender selection */}
          <div className="mb-8">
            <p className="mb-6 text-lg">🚻 What is your gender ?</p>
            <select
              name="gender"
              id="gender"
              required
              className="text-brown p-3 w-40 text-left rounded-lg bg-gray-300 shadow-2xl transition duration-300"
            >
              <option value="">Select Gender</option>
              <option value="male">♂ Male</option>
              <option value="female">♀️ Female</option>
            </select>
          </div>

          {/* Age input */}
          <div className="mb-8">
            <p className="mb-6 text-lg">🔢 What is your age ?</p>
            <input
              type="value"
              name="age"
              id="age"
              placeholder="In Years"
              required
              className="text-brown p-3 w-40 text-center rounded-lg bg-gray-300 shadow-2xl transition duration-300"
            />
          </div>

          {/* Current weight input */}
          <div className="mb-8">
            <p className="mb-6 text-lg">
              ⏳ What is your current weight ? (kg)
            </p>
            <input
              type="value"
              name="current-weight"
              id="current-weight"
              placeholder="In KG"
              required
              className="text-brown p-3 w-40 text-center rounded-lg bg-gray-300 shadow-2xl transition duration-300"
            />
          </div>

          {/* Target weight input */}
          <div className="mb-8">
            <p className="mb-6 text-lg">🚀 What is your target weight ? (kg)</p>
            <input
              type="value"
              name="target-weight"
              id="target-weight"
              placeholder="In KG"
              required
              className="text-brown p-3 w-40 text-center rounded-lg bg-gray-300 shadow-2xl transition duration-300"
            />
          </div>

          {/* Workout type selection */}
          <div className="mb-8">
            <p className="mb-6 text-lg">
              🏋🏻‍♀️ What type of workout do you prefer ?{" "}
            </p>
            <div className="radio-inputs">
              {types.map((type, index) => {
                return (
                  <label className="radio" key={index}>
                    <input
                      type="radio"
                      name="type"
                      id="type"
                      value={type.value}
                      required
                    />
                    <span className="name">{type.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Days to cover input */}
          <div className="mb-8">
            <p className="mb-6 text-lg">
              📅 How many days should the workout plan cover ?{" "}
            </p>
            <input
              type="range"
              name="days"
              id="days"
              min="28"
              max="168"
              step="7"
              value={sliderValue}
              onChange={sliderChange}
              required
              className="w-64 appearance-none bg-beige h-2 rounded-md focus:outline-none "
            />
            <br></br>
            <p className="text-lg">{sliderValue}</p>
          </div>

          {/* Workout frequency selection */}
          <div className="mb-8">
            <p className="mb-6 text-lg">
              📈 How often do you want to workout ?{" "}
            </p>
            <select
              name="often"
              id="often"
              required
              className="text-brown p-3 w-40 text-left rounded-lg bg-gray-300 shadow-2xl transition duration-300"
            >
              <option value="">Frequency </option>
              {often.map((often, index) => {
                return (
                  <option value={often.value} key={index}>
                    {often.label}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Rendering button to generate workout plan */}
        {token ? (
          <button
            type="submit"
            className="mb-12 py-2 px-4 text-lg text-brown rounded-md bg-cream cursor-pointer transition-all hover:bg-beige hover:text-cream focus:bg-white focus:outline-none"
          >
            Generate Workout
          </button>
        ) : (
          <h1 className="my-12 py-2 px-4 text-3xl text-cream">
            Please Login to Generate Workout
          </h1>
        )}

        {/* Rendering generated workout plan */}
        {dataAI && token && (
          <div
            ref={dataRef}
            className="m-16 whitespace-pre-wrap bg-cream rounded-md"
          >
            <h2 className="m-12 text-3xl text-brown font-bold pt-12 rounded-sm">
              Workout Plan
            </h2>
            <div className="p-12 font-semibold text-brown text-lg">
              {dataAI}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
