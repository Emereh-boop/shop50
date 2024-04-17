import React, { useState } from "react";
import googleIcon from "../images/google.svg";
//import useNavigate
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";

export default function Register() {
  //initialize navigate
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate("/login");
  };
  onAuthStateChanged(auth, (currentUser) => {
    setCurrentUser(currentUser);
  });
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [error, setError] = useState("");

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      alert(`user ${currentUser} is signed in`);
      //navigate to login page after sign up
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className="flex flex-col md:grid grid-cols-4 p-4">
      <div className="flex flex-col gap-10 col-span-4 md:p-10">
        {/* <div>
          <h2 className="text-2xl md:text-4xl text-center font-medium">
            {" "}
            WELCOME!
          </h2>
          <p className="text-center text-sm">
            Enter your email and password to Register
          </p>
        </div> */}
        <form className="flex justify-center ">
          <div className="flex flex-col w-full md:w-1/4  gap-2">
            <label htmlFor="username">Email/Username</label>
            <input
              className="ring-2 ring-black rounded-lg p-2"
              name="username"
              type="email "
              placeholder="Enter your username or Email"
              onChange={(event) => {
                setRegisterEmail(event.target.value);
              }}
            />

            <label htmlFor="password">Password </label>
            <input
              className="ring-2 ring-black rounded-lg p-2"
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={(event) => {
                setRegisterPassword(event.target.value);
              }}
            />
            {/* <label htmlFor="password">Confirm password </label>
                  <input
                    className="ring-2 ring-black rounded-lg p-2"
                    name="password"
                    type="password"
                    placeholder="Retype password"
                  /> */}

            <div className="flex justify-between text-blue-700">
              <div className="flex gap-1 text-red-700">
                {/* <input className="" type="checkbox" /> */}
                {error}
              </div>
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
              <img src={googleIcon} alt=" google icon" />
              <input
                className="ring-0 ring-white outline-none text-center"
                name="Google"
                type="button"
                value=" Google"
              />
            </div>

            <p className="flex justify-center gap-1">
              Already have an account?{" "}
              <span onClick={navigateToLogin} className="font-bold">
                Login{" "}
              </span>{" "}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
