import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Google } from "react-bootstrap-icons";

export default function Register() {
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate("/login");
  };

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [error, setError] = useState("");

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      navigate("/login");
    } catch (error) {
      setError("Invalid credentials:", error.message);
    }
  };
  return (
    <div className="p-4 h-screen  flex justify-center">
      <div className="flex flex-col gap-10 rounded-xl shadow-2xl self-center  md:p-10 md:w-1/4">
        <form className="flex justify-center ">
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="username">Email/Username</label>
            <input
              className="ring-2 ring-black rounded-lg p-2"
              type="email "
              required
              id="username"
              autoComplete="username"
              placeholder="Enter your username or Email"
              onChange={(event) => {
                setRegisterEmail(event.target.value);
              }}
            />

            <label htmlFor="password">Password </label>
            <input
              className="ring-2 ring-black rounded-lg p-2"
              type="password"
              id="password"
              required
              placeholder="Enter your password"
              onChange={(e) => {
                setRegisterPassword(e.target.value);
              }}
            />

            <div className="flex justify-between text-blue-700">
              <div className="flex gap-1 text-red-700">{error}</div>
            </div>

            <button
              onClick={register}
              className="rounded-lg ring-2 ring-black
             bg-black text-white p-2"
              type="button"
            >
              Register
            </button>
            <p className="flex justify-center">Or</p>
            <div className="ring-2 ring-black rounded-lg p-2 flex justify-center gap-1">
              <Google />
              <input
                className="ring-0 ring-white outline-none text-center"
                name="Google"
                type="button"
                value=" Google"
              />
            </div>

            <p className="flex justify-center gap-1">
              Already have an account?{" "}
              <span
                onClick={navigateToLogin}
                className="font-bold cursor-default"
              >
                Login{" "}
              </span>{" "}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
