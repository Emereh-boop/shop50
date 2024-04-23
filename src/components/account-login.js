import React, { useContext, useState } from "react";
// import googleIcon from "../images/google.svg";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import ShopContext from "../context/cart/shop-context";

export default function Login() {
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");

  const { setUserIsLoggedIn, userIsLoggedIn } = useContext(ShopContext);

  const navigateToRegister = () => {
    navigate("/register");
  };
  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      // setUserIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className=" p-4 h-screen bg-hero-pattern flex justify-center ">
      <div className="flex flex-col gap-10 rounded-xl shadow-2xl self-center bg-teal-50 md:p-10 md:w-1/4 ">
        {/* <div>
          <h2 className="text-2xl md:text-4xl text-center font-medium">
            {" "}
            WELCOME BACK!
          </h2>
          <p className="text-center text-sm">
            Enter your email and password to login
          </p>
        </div> */}
        <form className="flex justify-center ">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="username">Email/Username</label>
            <input
              id="username"
              className="ring-2 ring-black rounded-lg p-2"
              type="email"
              required
              autoComplete="username"
              placeholder="Enter your username or Email"
              onChange={(event) => {
                setLoginEmail(event.target.value);
              }}
            />

            <label htmlFor="password">Password </label>
            <input
              className="ring-2 ring-black rounded-lg p-2"
              type="password"
              id="password"
              required
              placeholder="Enter your password"
              onChange={(event) => {
                setLoginPassword(event.target.value);
              }}
            />

            <div className="flex justify-between text-blue-700">
              <div className="flex gap-1 text-black">
                <input id="checkbox" title="checkbox" type="checkbox" />
                Remember me
              </div>{" "}
              <p>Forgot password?</p>
            </div>
            <div className="flex gap-1 text-red-700">{error}</div>

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

            <p className="flex justify-center gap-1 cursor-default">
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
