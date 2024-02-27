// Functional component for displaying an error message
export default function Error() {
  // The component returns a main section containing error information
  return (
    <main className="flex items-center justify-center h-screen text-red text-5xl text-center">
      <div>
        {/* Heading with an error message */}
        <h1>
          Oopss..., an error occurred or the page you are trying to find does
          not exist.
        </h1>
        {/* Additional message for the user */}
        <p>Please try again later.</p>
      </div>
    </main>
  );
}
