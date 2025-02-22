import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Please check your inbox.");
      setTimeout(() => navigate("/login"), 3000); // Redirect after 3 seconds
    } catch (error) {
      setError("Error: " + error.message);
    }
  };

  return (
    <div className="p-4 h-screen flex justify-center">
      <div className="self-start md:w-full md:px-10 ">
        <form className="flex justify-center">
          <div className="flex flex-col w-full gap-5">
            <div className="mx-auto w-full max-w-sm">
              {/* <img
                className="mx-auto h-10 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company"
              /> */}
              <p className="font-black text-4xl text-pink-400 text-center">
                YNT
              </p>
            </div>
            <h2>Forgot Password</h2>

            <label htmlFor="email">Email Address</label>
            <input
              className="ring-1 ring-primary rounded-sm p-2"
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {error && <div className="text-red-500">{error}</div>}
            {message && <div className="text-green-500">{message}</div>}

            <button
              onClick={handleResetPassword}
              className="rounded-sm ring-1 ring-primary bg-black text-white p-2"
              type="button"
            >
              Send Reset Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
