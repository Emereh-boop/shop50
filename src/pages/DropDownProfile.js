import React, { useContext } from "react";
// import profileIcon from "../images/account.svg";
import logoutIcon from "../images/logout.svg";
import signUpIcon from "../images/signup.svg";
import { Link } from "react-router-dom";
import ShopContext from "../context/cart/shop-context";

export default function DropDownProfile() {
  const { logout } = useContext(ShopContext);
  return (
    <div className="flex flex-col absolute top-20 right-7 w-32 p-4 rounded-lg bg-white shadow-xl ring-gray-500">
      <ul className="flex flex-col">
        <li className="hover:bg-neutral-200 p-2">Profile</li>
        <Link to="/register">
          <li className="hover:bg-neutral-200 p-2 flex gap-2">
            SignUp <img src={signUpIcon} alt="signUp Icon" />
          </li>
        </Link>
        <Link to="/login">
          <li className=" hover:bg-neutral-200 p-2">Login</li>
        </Link>

        <li onClick={logout} className="hover:bg-red-500 flex p-2 gap-2">
          Logout <img alt="Logout Icon" src={logoutIcon} />
        </li>
      </ul>
    </div>
  );
}
