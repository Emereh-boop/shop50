import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { Google } from "react-bootstrap-icons";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Toast from "../../components/common/toast"; // Import the Toast component
import Logo from "../../images/yntlogo.png";

export default function Login() {
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const login = async () => {
    setError(""); // Clear previous errors
    try {
      if (loginPassword.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }

      // Sign in with email and password
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);

      // If login is successful, navigate to home page
      navigate("/");
    } catch (error) {
      // Handle different error cases
      if (error.message === "auth/user-not-found") {
        setError("No user found with this email.");
      } else if (error.message === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (error.message === "auth/invalid-email") {
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
    <div className="p-4 max-h-[100vh] mt-14 ">
      {error && <Toast message={error} clearMessage={() => setError("")} />}
      <div className=" md:px-10 w-full flex flex-col justify-center items-center">
        <div className="mx-auto w-full max-w-sm gap-3">
          <img
            className=" mx-auto h-16 w-16 object-cover rounded-full"
            src={Logo}
            alt="YNT"
          />

          <h2 className="text-center text-xl font-bold leading-9 tracking-tight text-black">
            Sign in to your account
          </h2>
        </div>
        <form className="lg:w-1/4 w-full lg:shadow-lg flex flex-col gap-3 p-5">
          {/* <div className=""> */}
          <label className="text-sm text-[#00000088]" htmlFor="email">
            Email/Username
          </label>
          <input
            className="ring-1 ring-gray-300 rounded-sm p-2"
            type="email"
            required
            id="email"
            autoComplete="username"
            placeholder="Enter your email"
            onChange={(event) => {
              setLoginEmail(event.target.value);
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
            className="rounded-sm ring-1 ring-gray-700 bg-gray-700 text-secondary p-2"
            type="button"
          >
            Login
          </button>
          <p className="flex justify-center">Or</p>

          <div className="ring-1 ring-gray-300 rounded-sm p-2 items-center flex justify-center gap-1">
            <Google />
            <input
              onClick={handleGoogleLogin}
              className="ring-0 outline-none text-center cursor-pointer"
              name="Google"
              type="button"
              value=" Google"
            />
          </div>
          <div className="flex items-center flex-col gap-1 ">
            <p className="flex justify-center gap-1 text-sm">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-blue-500 cursor-pointer"
              >
                Register{" "}
              </span>
            </p>

            <p className="flex justify-center text-sm gap-1">
              Forgot your password?{" "}
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-blue-500 cursor-pointer"
              >
                Reset
              </span>
            </p>
          </div>
          {/* </div> */}
        </form>
      </div>
    </div>
  );
}
