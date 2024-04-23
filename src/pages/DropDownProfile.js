import React, { useContext } from "react";
// import profileIcon from "../images/account.svg";
import logoutIcon from "../images/logout.svg";
import signUpIcon from "../images/signup.svg";
import { Link } from "react-router-dom";
import ShopContext from "../context/cart/shop-context";
import Popup from "reactjs-popup";
import { CheckCircleFill, XOctagonFill } from "react-bootstrap-icons";

export default function DropDownProfile() {
  const { logout, refreshPage } = useContext(ShopContext);
  return (
    <div
      className={`flex flex-col rounded-lg items-end bg-stone-100 ring-gray-500`}
    >
      <ul className="flex p-3 flex-col">
        <Link to="/register">
          <li className="hover:bg-neutral-200 p-2 flex gap-2">
            SignUp <img src={signUpIcon} alt="signUp Icon" />
          </li>
        </Link>
        <Link to="/login">
          <li className=" hover:bg-neutral-200 p-2">Login</li>
        </Link>
        <Popup
          trigger={
            <li className="hover:bg-red-500 flex p-2 gap-2">
              Logout <img alt="Logout Icon" src={logoutIcon} />
            </li>
          }
          position={"right center"}
          modal="nested"
        >
          <div className="bg-black/80 h-screen w-screen flex justify-center items-center">
            <div className="text-center gap-5 rounded-md flex flex-col shadow-xl w-1/4 h-1/4 p-10  bg-white">
              <div className="text-lg ">Confirm logout</div>
              <div className="flex gap-6 justify-center">
                <XOctagonFill
                  onClick={refreshPage}
                  color="red"
                  className="text-red-700"
                  size={40}
                />
                <CheckCircleFill
                  onClick={logout}
                  className="text-green-700"
                  size={40}
                />
              </div>
            </div>
          </div>
        </Popup>
      </ul>
    </div>
  );
}
