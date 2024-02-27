// Functional component for an input field
export default function Input({
  label,
  type,
  name,
  id,
  placeholder,
  ...props
}) {
  // The component returns a structure containing a label and an input field
  return (
    <label className="flex items-center justify-between mt-4 mb-4 text-brown">
      {/* Input field with specified attributes */}
      <p className="mr-8 text-xl">{label}</p>
      <input
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        {...props}
        className="p-3 rounded-lg bg-gray-300 shadow-2xl transition duration-300 text-brown w-80 disabled:opacity-50 disabled:text-gray-500"
      />
    </label>
  );
}
