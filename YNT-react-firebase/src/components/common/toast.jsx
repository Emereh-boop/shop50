import React, { useEffect, useState } from "react";

export default function Toast({ message, type, clearMessage }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (message) {
      setShow(true);
      setTimeout(() => {
        setShow(false);
        clearMessage();
      }, 3000); // Hide the message after 3 seconds
    }
  }, [message, clearMessage]);

  // Determine the background color based on the message type
  const getToastStyle = () => {
    if (type === "error") {
      return "bg-red-500";
    } else if (type === "success") {
      return "bg-green-500";
    } else {
      return "bg-gray-500";
    }
  };

  return (
    show && (
      <div
        className={`fixed top-30 left-1/2 transform z-[9999] -translate-x-1/2 p-3 text-white rounded-md shadow-md ${getToastStyle()}`}
        style={{ zIndex: 9999 }}
      >
        {message}
      </div>
    )
  );
}
