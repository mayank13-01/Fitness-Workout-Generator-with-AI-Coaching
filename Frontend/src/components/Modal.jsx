// Importing necessary React hooks and functions
import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { RingSpinner } from "react-spinners-kit";

// Functional component for a modal
export default function Modal({ open }) {
  // Creating a ref to the dialog element
  const dialog = useRef();

  // Effect hook to handle key events and modal state changes
  useEffect(() => {
    // Event handler for the "Escape" key
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
      }
    };

    // Function to handle modal state based on the "open" prop
    const handleModalState = () => {
      if (dialog.current) {
        if (open) {
          dialog.current.showModal();
        } else {
          dialog.current.close();
        }
      }
    };

    // Adding event listener for keydown
    document.addEventListener("keydown", handleKeyDown);

    // Handling modal state
    handleModalState();

    // Cleanup: removing event listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Rendering the modal using createPortal
  return open
    ? createPortal(
        // Dialog element with optional loading spinner
        <dialog className="modal" ref={dialog}>
          {open && <RingSpinner size={100} color="#EEEEEE" />}
        </dialog>,
        // Portal target element
        document.getElementById("modal")
      )
    : null;
}
