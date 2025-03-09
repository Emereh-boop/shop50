import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Logo from "../../images/yntlogo.png";
import Toast from "../../components/common/toast";
import LoginModal from "./Login"; // Import the Login component

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false); // State to handle modal visibility

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Please check your inbox.");
      setTimeout(() => setIsOpen(true), 3000); // Redirect after 3 seconds
    } catch (error) {
      setError("Error: " + error.message);
    }
  };

  // Function to open the Login modal
  const openLoginModal = () => {
    setIsOpen(true);
  };

  return (
    <div
      className="p-4 h-screen flex justify-center items-center"
      style={{
        backgroundImage: `url('https://your-ecommerce-background-image-url.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {error && (
        <Toast
          message={error}
          type="error"
          clearMessage={() => setError("")}
        />
      )}
      {message && (
        <Toast
          message={message}
          type="success"
          clearMessage={() => setMessage("")}
        />
      )}

      <div className="md:px-10 w-full flex flex-col justify-center items-center bg-white bg-opacity-80 p-5 rounded-md">
        <div className="mx-auto w-full max-w-sm gap-3">
          {/* <img
            className="mx-auto h-16 w-16 object-cover rounded-full"
            src={Logo}
            alt="YNT"
          /> */}
          <h2 className="text-center text-md font-bold leading-9 tracking-tight text-black">
            Reset Password
          </h2>
        </div>

        <form className="lg:w-1/4 w-full lg:shadow-lg flex flex-col gap-3 p-5">
          <label className="text-sm text-[#00000088]" htmlFor="email">
            Email Address
          </label>
          <input
            className="ring-1 ring-gray-300 rounded-sm p-2"
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={handleResetPassword}
            className="rounded-sm ring-1 ring-gray-800 bg-gray-800 text-white p-1 w-full"
            type="button"
          >
            Send Reset Email
          </button>

          <div className="flex items-center flex-col gap-1">
            <p className="flex justify-center gap-1">
              Remember your password?{" "}
              <span
                onClick={openLoginModal} // Open the login modal on click
                className="text-blue-600 cursor-pointer"
              >
                Login
              </span>
            </p>
          </div>
        </form>
      </div>

      {/* Conditional rendering of the Login modal */}
      {isOpen && (
        <LoginModal isOpen={isOpen} setIsOpen={setIsOpen} /> // Pass state and setter function to Login modal
      )}
    </div>
  );
}
