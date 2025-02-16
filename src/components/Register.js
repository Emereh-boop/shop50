import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { Google } from "react-bootstrap-icons";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Toast from "../components/toast"; // Import the Toast component

export default function Register() {
  const navigate = useNavigate();
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Password format validation regex (minimum 8 characters, 1 number, 1 special character)
  const passwordPattern =
    /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const register = async () => {
    setError(""); // Clear previous errors

    // Check password format
    if (!passwordPattern.test(registerPassword)) {
      setError(
        "Password must be at least 8 characters, include a number and a special character."
      );
      return;
    }

    try {
      // Create user with email and password
      await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );

      // Sign in immediately after successful registration
      await signInWithEmailAndPassword(auth, registerEmail, registerPassword);

      // If registration and login are successful, navigate to home page
      setError("Registration successful!"); // Success message
      navigate("/");
    } catch (error) {
      // Handle different error cases
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already associated with an account.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak. Please use a stronger password.");
      } else {
        setError("Error: " + error.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      setError("Error with Google login: " + error.message);
    }
  };

  return (
    <div className="p-4 h-screen flex justify-center">
      {error && (
        <Toast
          message={error}
          type={error.includes("success") ? "success" : "error"}
          clearMessage={() => setError("")}
        />
      )}
      <div className="self-start md:px-10 md:w-full">
        <form className="flex justify-center">
          <div className="flex flex-col w-full gap-5">
            <div className="mx-auto w-full max-w-sm">
              <p className="font-black text-4xl text-pink-400 text-center">
                YNT
              </p>
              <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-primary">
                Create your account
              </h2>
            </div>

            <label htmlFor="username">Email/Username</label>
            <input
              className="ring-1 ring-primary rounded-sm p-2"
              type="email"
              required
              id="username"
              autoComplete="username"
              placeholder="Enter your username or Email"
              onChange={(event) => {
                setRegisterEmail(event.target.value);
              }}
            />

            <label htmlFor="password">Password</label>
            <div className="relative">
              <input
                className="ring-1 ring-primary rounded-sm p-2 w-full"
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
              className="rounded-sm ring-1 ring-primary bg-primary text-secondary p-2"
              type="button"
            >
              Register
            </button>
            <p className="flex justify-center">Or</p>

            <div className="ring-1 ring-primary rounded-sm p-2 flex items-center justify-center gap-1">
              <Google />
              <input
                onClick={handleGoogleLogin}
                className="ring-0 outline-none text-center cursor-pointer"
                name="Google"
                type="button"
                value=" Google"
              />
            </div>

            <div className="flex items-center flex-col gap-1">
              <p className="flex justify-center gap-1">
                Don't have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-blue-600 cursor-pointer"
                >
                  Login
                </span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
