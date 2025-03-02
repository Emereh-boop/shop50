import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase/firebase";
import Toast from "../../components/common/toast"; // Import the Toast component
import Logo from "../../images/yntlogo.png";
import { Person, Plus } from "react-bootstrap-icons";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage imports
import { db } from "../../firebase/firebase"; // Firestore import
import { doc, setDoc } from "firebase/firestore"; // Firestore methods
import { Person2 } from "@mui/icons-material";

export default function Register() {
  const navigate = useNavigate();
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [selectedImage, setSelectedImage] = useState(null); // Store the selected image
  const [imagePreview, setImagePreview] = useState(null); // Store the image preview URL

  // Firebase storage instance
  const storage = getStorage();

  // Password format validation regex (minimum 8 characters, 1 number, 1 special character)
  const passwordPattern =
    /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const register = async () => {
    setError(""); // Clear previous errors

    // Check password format
    if (registerPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );

      // If there's an image, upload it to Firebase Storage
      let imageURL = "";
      if (selectedImage) {
        const imageRef = ref(storage, `profile_pictures/${selectedImage.name}`);
        await uploadBytes(imageRef, selectedImage);
        imageURL = await getDownloadURL(imageRef);
      }

      // Store user data in Firestore
      const userRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userRef, {
        displayName: registerName,
        email: registerEmail,
        photoURL: imageURL,
        role: "user", // Default role is "user"
        uid: userCredential.user.uid,
      });

      // Sign in the user after registration
      await signInWithEmailAndPassword(auth, registerEmail, registerPassword);

      // Success, navigate to home page
      setError("Registration successful!"); // Success message
      navigate("/");
    } catch (error) {
      // Handle different error cases
      if (error.message === "auth/email-already-in-use") {
        setError("This email is already associated with an account.");
      } else if (error.mesage === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (error.message === "auth/weak-password") {
        setError("Password is too weak. Please use a stronger password.");
      } else {
        setError("Error: " + error.message);
      }
    }
  };

  // Handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file)); // Preview image
    }
  };

  return (
    <div className="p-4 h-screen flex justify-center">
      {error && (
        <Toast
          message={error}
          type={error.includes("success") ? "success" : "error"}
          clearMessage={() => setError("")}
        />
      )}
      <div className="md:px-10 w-full flex flex-col justify-center items-center">
        <div className="mx-auto w-full max-w-sm gap-3">
          <img
            className="mx-auto h-16 w-16 object-cover rounded-full"
            src={Logo}
            alt="YNT"
          />
          <h2 className="text-center text-xl font-bold leading-9 tracking-tight text-black">
            Sign up for an account
          </h2>
        </div>
        <form className="lg:w-1/4 w-full lg:shadow-lg flex flex-col gap-3 p-5">
          {/* Hidden file input */}
          <label className="text-base flex items-center gap-2 text-[#000]" htmlFor="file-upload">
            <Person className=" w-14 h-14 ring-[0.5px] rounded-full ring-black"/> profile photo
          </label>
          <input
            type="file"
            id="file-upload"
            accept="image/jpeg, image/png, image/jpg"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />

          {/* Display the selected image preview */}
          {imagePreview && (
            <div className="mb-3">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-full border"
              />
            </div>
          )}

          <label className="text-sm text-[#00000088]" htmlFor="name">
            Name
          </label>
          <input
            className="ring-1 ring-gray-300 rounded-sm p-2"
            type="text"
            required
            id="name"
            autoComplete="name"
            placeholder="Enter your name"
            onChange={(event) => {
              setRegisterName(event.target.value);
            }}
          />
          <label className="text-sm text-[#00000088]" htmlFor="email">
            Email
          </label>
          <input
            className="ring-1 ring-gray-300 rounded-sm p-2"
            type="email"
            required
            id="email"
            autoComplete="username"
            placeholder="Enter your email"
            onChange={(event) => {
              setRegisterEmail(event.target.value);
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
                setRegisterPassword(e.target.value);
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
            onClick={register}
            className="rounded-sm ring-1 ring-gray-700 bg-gray-700 text-secondary p-2"
            type="button"
          >
            Register
          </button>

          <div className="flex items-center flex-col gap-1">
            <p className="flex justify-center gap-1">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-600 cursor-pointer"
              >
                Login
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
