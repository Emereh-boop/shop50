import React, { useState } from "react";
import googleIcon from "../images/google.svg";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const navigateToRegister = () => {
    navigate("/register");
  };
  const login = () => {};
  return (
    <div className=" p-4">
      <div className="flex flex-col gap-10 md:p-10 md:w-screen ">
        <div>
          <h2 className="text-2xl md:text-4xl text-center font-medium">
            {" "}
            WELCOME BACK!
          </h2>
          <p className="text-center text-sm">
            Enter your email and password to login
          </p>
        </div>
        <form className="flex justify-center ">
          <div className="flex flex-col gap-2 w-full md:w-1/2">
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

            <div className="flex justify-between text-blue-700">
              <div className="flex gap-1 text-black">
                <input className="" type="checkbox" />
                Remember me
              </div>{" "}
              <p>Forgot password?</p>
            </div>

            <button
              onClick={() => login()}
              className="rounded-lg ring-2 ring-black
             bg-black text-white p-2"
              type="button"
            >
              Login
            </button>
            {/* <p className="flex justify-center">Or</p>
            <div className="ring-2 ring-black rounded-lg p-2 flex justify-center gap-1">
              <img src={googleIcon} alt="" />
              <input
                className="ring-0 ring-white outline-none text-center"
                name="Apple"
                type="button"
                value="Google"
              />
            </div> */}

            <p className="flex justify-center gap-1 cursor-pointer">
              Don't have an account?{" "}
              <span className="font-bold" onClick={navigateToRegister}>
                Register{" "}
              </span>{" "}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
