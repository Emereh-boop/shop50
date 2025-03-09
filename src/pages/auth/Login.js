import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate, useLocation } from "react-router-dom";
import google from "../../images/download-removebg-preview.png"
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase/firebase";
import Toast from "../../components/common/toast";
import Logo from "../../images/yntlogo.png";

export default function LoginModal({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from || "/";

  const login = async () => {
    setError("");
    try {
      if (loginPassword.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setIsOpen(false);
      // navigate(from, { replace: true });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setIsOpen(false);
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        {/* ✅ Fixed: No need for show={isOpen} here */}
        <Transition.Child
          show={isOpen}
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel className="relative transform overflow-hidden rounded-sm bg-white text-left shadow-xl transition-all max-w-sm w-full">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                {error && <Toast message={error} clearMessage={() => setError("")} />}
                <div className="sm:flex sm:items-start flex flex-col items-center">
                  {/* <img className="mx-auto h-16 w-16 object-cover rounded-full" src={Logo} alt="YNT" /> */}
                  <h2 className="text-center text-xl font-bold text-black mt-3">
                    Welcome back, Login to your account
                  </h2>

                  <form className="w-full flex flex-col gap-3 mt-4">
                    <label className="text-sm text-gray-800" htmlFor="email">Email</label>
                    <input
                      className="ring-1 ring-gray-300 rounded-sm p-2"
                      type="email"
                      required
                      id="email"
                      placeholder="Enter your email"
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />

                    <label className="text-sm text-gray-600" htmlFor="password">Password</label>
                    <div className="relative">
                      <input
                        className="ring-1 ring-gray-300 rounded-sm p-2 w-full"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        required
                        placeholder="Enter your password"
                        onChange={(e) => setLoginPassword(e.target.value)}
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
                      className="rounded-sm ring-1 ring-gray-800 bg-gray-800 text-white p-1 w-full"
                      type="button"
                    >
                      Login
                    </button>

                    <p className="text-center text-sm text-gray-500">Or</p>

                    <button
                      onClick={handleGoogleLogin}
                      className="ring-1 ring-gray-300 rounded-sm p-1 flex justify-center gap-1 items-center"
                      type="button"
                    >
                      <img src={google} className="w-20 h-10" alt=""/>
                      <span>Continue with Google</span>
                    </button>

                    <div className="text-center text-sm text-gray-500 mt-2">
                      <p>
                        Don't have an account?{" "}
                        <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/register")& setIsOpen(false)}>
                          Register
                        </span>
                      </p>
                      <p>
                        Forgot password?{" "}
                        <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/forgot-password") & setIsOpen(false)}>
                          Reset
                        </span>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
