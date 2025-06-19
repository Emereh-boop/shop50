import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase/firebase";
import Toast from "../../components/common/toast"; // Import the Toast component
import { db } from "../../firebase/firebase"; // Firestore import
import { doc, setDoc } from "firebase/firestore"; // Firestore methods

import LoginModal from "./Login"; // Import the Login component

export default function Register() {
  const navigate = useNavigate();
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [isOpen, setIsOpen] = useState(false); // State to handle modal visibility

  const register = async () => {
    setError(""); // Clear previous errors

    // Check password format
    if (registerPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );

      // Store user data in Firestore
      const userRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userRef, {
        displayName: registerName,
        email: registerEmail,
        role: "user", // Default role is "user"
        uid: userCredential.user.uid,
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);

      // Show success message
      setSuccess(
        "Registration successful! A verification email has been sent. Please check your inbox."
      );

      // Optionally sign in the user after registration (if desired)
      await signInWithEmailAndPassword(auth, registerEmail, registerPassword);


      // Redirect after a few seconds (optional)
      setTimeout(() => {
        navigate('/')
      }, 3000);
    } catch (error) {
      // Handle different error cases
      if (error.message === "auth/email-already-in-use") {
        setError("This email is already associated with an account.");
      } else if (error.mesage === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (error.message === "auth/weak-password") {
        setError("Password is too weak. Please use a stronger password.");
      } else {
        setError("Error: " + error.message);
      }
    }
  };

  // Handle image selection
  // const handleImageChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setSelectedImage(file);
  //     setImagePreview(URL.createObjectURL(file)); // Preview image
  //   }
  // };
  // Function to open the Login modal
  const openLoginModal = () => {
    setIsOpen(true);
  };

  return (
    <div
      className="p-4 h-screen flex justify-center items-center"
      style={{
        backgroundImage: `url('https://your-ecommerce-background-image-url.jpg')`, // Add the eCommerce background image URL here
        backgroundSize: "cover", // Ensures the background image covers the screen
        backgroundPosition: "center", // Centers the background image
        backgroundRepeat: "no-repeat", // Prevents the background from repeating
      }}
    >
      {error && (
        <Toast
          message={error}
          type={error.includes("success") ? "success" : "error"}
          clearMessage={() => setError("")}
        />
      )}
      {success && (
        <Toast
          message={success}
          type="success"
          clearMessage={() => setSuccess("")}
        />
      )}
      <div className="md:px-10 w-full flex flex-col justify-center items-center bg-white bg-opacity-80 p-5 rounded-md">
        <div className="mx-auto w-full max-w-sm gap-2">
          {/* <img
            className="mx-auto h-16 w-16 object-cover rounded-full"
            src={Logo}
            alt="YNT"
          /> */}
          <h2 className="text-center text-xl font-bold leading-9 tracking-tight text-black">
            Sign up
          </h2>
        </div>
        <form className="lg:w-1/4 w-full lg:shadow-lg flex flex-col gap-2 p-5">

          <label className="text-sm text-[#00000088]" htmlFor="name">
            Name
          </label>
          <input
            className="ring-1 ring-gray-300 rounded-sm p-2"
            type="text"
            required
            id="name"
            autoComplete="name"
            placeholder="Enter your name"
            onChange={(event) => {
              setRegisterName(event.target.value);
            }}
          />
          <label className="text-sm text-[#00000088]" htmlFor="email">
            Email
          </label>
          <input
            className="ring-1 ring-gray-300 rounded-sm p-2"
            type="email"
            required
            id="email"
            autoComplete="username"
            placeholder="Enter your email"
            onChange={(event) => {
              setRegisterEmail(event.target.value);
            }}
          />

          <label className="text-sm text-[#00000088]" htmlFor="password">
            Password{" "}
          </label>
          <div className="relative">
            <input
              className="ring-1 ring-gray--300 rounded-sm p-2 w-full"
              type={showPassword ? "text" : "password"}
              id="password"
              required
              placeholder="Enter your password"
              onChange={(e) => {
                setRegisterPassword(e.target.value);
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-xs text-gray-400"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            onClick={register}
            className="rounded-sm ring-1 ring-gray-800 bg-gray-800 text-secondary p-1 w-full"
            type="button"
          >
            Register
          </button>

          <div className="flex items-center flex-col gap-1">
            <p className="flex justify-center gap-1">
              Already have an account?{" "}
              <span
                onClick={openLoginModal}
                className="text-blue-600 cursor-pointer"
              >
                Login
              </span>
            </p>
          </div>
        </form>
      </div>
      {isOpen && (
        <LoginModal isOpen={isOpen} setIsOpen={setIsOpen} /> // Pass state and setter function to Login modal
      )}
    </div>
  );
}
