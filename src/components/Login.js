import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Google } from "react-bootstrap-icons";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Toast from "../components/toast"; // Import the Toast component

export default function Login() {
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const login = async () => {
    setError(""); // Clear previous errors

    try {
      // Sign in with email and password
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);

      // If login is successful, navigate to home page
      navigate("/");
    } catch (error) {
      // Handle different error cases
      if (error.code === "auth/user-not-found") {
        setError("No user found with this email.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
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
      {error && <Toast message={error} clearMessage={() => setError("")} />}
      <div className="self-start md:px-10 md:w-full">
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
              <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-primary">
                Sign in to your account
              </h2>
            </div>
            <label htmlFor="email">Email/Username</label>
            <input
              className="ring-1 ring-primary rounded-sm p-2"
              type="email"
              required
              id="email"
              autoComplete="username"
              placeholder="Enter your email"
              onChange={(event) => {
                setLoginEmail(event.target.value);
              }}
            />

            <label htmlFor="password">Password </label>
            <div className="relative">
              <input
                className="ring-1 ring-primary rounded-sm p-2 w-full"
                type={showPassword ? "text" : "password"}
                id="password"
                required
                placeholder="Enter your password"
                onChange={(e) => {
                  setLoginPassword(e.target.value);
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
              onClick={login}
              className="rounded-sm ring-1 ring-primary bg-primary text-secondary p-2"
              type="button"
            >
              Login
            </button>
            <p className="flex justify-center">Or</p>

            <div className="ring-1 ring-primary rounded-sm p-2 items-center flex justify-center gap-1">
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
                  onClick={() => navigate("/register")}
                  className="text-blue-600 cursor-pointer"
                >
                  Register{" "}
                </span>
              </p>

              <p className="flex justify-center gap-1">
                Forgot your password?{" "}
                <span
                  onClick={() => navigate("/forgot-password")}
                  className="text-blue-600 cursor-pointer"
                >
                  Reset
                </span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
