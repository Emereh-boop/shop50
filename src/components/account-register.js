import React from "react";
import appleIcon from "../images/apple.svg";

export default function Register() {
  const handleLogin = () => {
    window.location.href = "/login";
  };
  const handleRegistration = () => {
    window.location.href = "/home";
  };
  return (
    <div className="flex flex-col md:grid grid-cols-4 p-4">
      <div className="flex flex-col gap-10 col-span-4 md:p-10">
        <div>
          <h2 className="text-2xl md:text-4xl text-center font-medium">
            {" "}
            WELCOME!
          </h2>
          <p className="text-center text-sm">
            Enter your email and password to Register
          </p>
        </div>
        <form className="flex flex-col gap-2">
          <label htmlFor="username">Email/Username</label>
          <input
            className="ring-2 ring-black rounded-lg p-2"
            name="username"
            type="email "
            placeholder="Enter your username or Email"
          />

          <label htmlFor="password">Password </label>
          <input
            className="ring-2 ring-black rounded-lg p-2"
            name="password"
            type="password"
            placeholder="Enter your password"
          />
          <label htmlFor="password">Confirm password </label>
          <input
            className="ring-2 ring-black rounded-lg p-2"
            name="password"
            type="password"
            placeholder="Retype password"
          />

          <div className="flex justify-between text-blue-700">
            <div className="flex gap-1 text-black">
              <input className="" type="checkbox" />
              Remember me
            </div>
          </div>

          <button
            onClick={handleRegistration}
            className="rounded-lg ring-2 ring-black
             bg-black text-white p-2"
            type="button"
          >
            Register
          </button>
          <p className="flex justify-center">Or</p>
          <div className="ring-2 ring-black rounded-lg p-2 flex justify-center gap-1">
            <img src={appleIcon} alt="" />
            <input
              className="ring-0 ring-white outline-none text-center"
              name="Apple"
              type="button"
              value="Sign in with Apple"
            />
          </div>

          <p className="flex justify-center gap-1">
            Already have an account?{" "}
            <span onClick={handleLogin} className="font-bold">
              Login{" "}
            </span>{" "}
          </p>
        </form>
      </div>
    </div>
  );
}
