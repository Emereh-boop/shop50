import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile, updateEmail } from "firebase/auth";
import { useAuth } from "../../context/auth/context";
import { useUser } from "../../context/user/context";
import { Plus, Pencil, PersonCheck, Person } from "react-bootstrap-icons";
import { doc, updateDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase"; // assuming you already initialized Firebase
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, fetchSignInMethodsForEmail } from "firebase/auth";
import { Load } from "../../components/common/loading";
import LoginModal from "../auth/Login";
import { formatCurrency } from "../../utils/format";
import { Person2 } from "@mui/icons-material";

export default function Profile() {
    const navigate = useNavigate();
    const { user } = useAuth(); // Get user from auth context
    const { userData, loading, setUserData } = useUser(); // Get user data from user context
    const [newName, setNewName] = useState(""); // Handle name change
    const [newEmail, setNewEmail] = useState(""); // Handle email change
    const [imagePreview, setImagePreview] = useState(""); // Profile picture preview
    const [orders, setOrders] = useState([]); // Store orders
    const [loadingOrders, setLoadingOrders] = useState(true); // Loading state for orders
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);

    // Capitalize the first letter of the name
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    // Fetch user's orders from Firestore
    useEffect(() => {
        const fetchOrders = async () => {
            if (loading) return; // Don't proceed until loading is done

            if (!user) {
                setLoginModalOpen(true)
            }
            try {
                setLoadingOrders(true);
                const ordersRef = collection(db, "orders");
                const q = query(ordersRef, where("userId", "==", user?.uid));
                const querySnapshot = await getDocs(q);
                const fetchedOrders = [];
                querySnapshot.forEach((doc) => {
                    fetchedOrders.push({ id: doc.id, ...doc.data() });
                });
                setOrders(fetchedOrders); // Update state with fetched orders
            } catch (error) {
                console.error("Error fetching orders: ", error);
            } finally {
                setLoadingOrders(false);
            }
        };

        fetchOrders();
    }, [user, navigate, loading]);

    // Handle Name Change
    const handleNameChange = async () => {
        if (newName === userData?.displayName) return;
        try {
            if (!user) {
                throw new Error("User is not logged in.");
            }

            // Update name in Firestore
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                displayName: newName,
            });

            // Update name in Firebase Auth
            if (user.updateProfile) {
                await updateProfile(user, {
                    displayName: newName,
                });
            } else {
                throw new Error("User profile update failed.");
            }

            setUserData((prev) => ({ ...prev, displayName: newName }));
            alert("Name updated successfully!");
        } catch (error) {
            console.error("Error updating name:", error);
            alert("Failed to update name.");
        }
    };

    // Function to check if the email already exists
    const checkIfEmailExists = async (email) => {
        try {
            const methods = await fetchSignInMethodsForEmail(auth, email);
            return methods.length > 0; // If any methods exist, it means the email is already used
        } catch (error) {
            console.error("Error checking if email exists:", error);
            return false;
        }
    };

    // Function to reauthenticate the user (make sure to use the correct Firebase Auth instance)
    const reauthenticate = async (user, currentPassword) => {
        const auth = getAuth(); // Get the Firebase auth instance
        const credential = EmailAuthProvider.credential(user.email, currentPassword); // Create a credential from current email and password

        try {
            await reauthenticateWithCredential(user, credential); // Reauthenticate with the credential
        } catch (error) {
            console.error("Error during reauthentication: ", error);
            alert("Reauthentication required");
            throw new Error("Reauthentication required");
        }
    };

    // Handle Email Change
    const handleEmailChange = async () => {
        if (!newEmail || newEmail === user?.email) {
            alert("Please enter a valid email or use a different one.");
            return;
        }

        try {
            if (!user) {
                throw new Error("User is not logged in.");
            }

            // Check if email already exists in Firebase Auth
            const emailExists = await checkIfEmailExists(newEmail);
            if (emailExists) {
                alert("Email is already in use. Please try a different email.");
                return;
            }

            // Request the user to enter their password for reauthentication
            const currentPassword = prompt("Please enter your current password for reauthentication.");
            if (!currentPassword) {
                alert("Password is required for reauthentication.");
                return;
            }

            // Reauthenticate user before updating email
            await reauthenticate(user, currentPassword);

            // Update email in Firebase Auth
            const auth = getAuth();
            await updateEmail(user, newEmail);

            // Update email in Firestore
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { email: newEmail });

            // Update local state with the new email
            setUserData((prev) => ({ ...prev, email: newEmail }));
            alert("Email updated successfully!");
        } catch (error) {
            if (error.code === 'auth/requires-recent-login') {
                alert("You need to log in again to update your email.");
            } else {
                console.error("Error updating email:", error);
                alert("Failed to update email.");
            }
        }
    };

    // Handle Profile Image Change
    const handleProfileImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            setImagePreview(imageURL);

            try {
                const storage = getStorage();
                const storageRef = ref(storage, `profilePictures/${user?.uid}`);
                await uploadBytes(storageRef, file);
                const photoURL = await getDownloadURL(storageRef);

                await updateProfile(user, {
                    photoURL: photoURL,
                });

                const userRef = doc(db, "users", user?.uid);
                await updateDoc(userRef, {
                    photoURL: photoURL,
                });

                setImagePreview(photoURL);
                alert("Profile image updated successfully!");
            } catch (error) {
                console.error("Error updating profile image:", error);
                alert("Failed to update profile image.");
            }
        }
    };

    const handlePasswordReset = () => {
        navigate("/forgot-password");
    };
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    const handlePopupClose = () => {
        setShowLoginPopup(false);
    };

    const handleActionClick = (e) => {
        // Prevent interaction if user is not logged in
        if (!user) {
            setShowLoginPopup(true); // Show the login prompt popup
            e.preventDefault(); // Prevent default action like navigating or submitting
        }
    };
    if (loading || loadingOrders) return <Load />;

    return (
        <div className="flex flex-col lg:flex-row">
            {isLoginModalOpen && <LoginModal isOpen={isLoginModalOpen} setIsOpen={setLoginModalOpen} onClose={() => setLoginModalOpen(false)} />}
            <div className={`flex-1 lg:items-center lg:justify-center w-full p-8 bg-black/5 lg:mt-16 ${!user ? "opacity-50 cursor-not-allowed" : ""}`}>
                <div className="flex flex-col lg:justify-center items-start">
                    {/* Profile Image */}
                    <div className="relative mb-4 flex justify-self-center flex-col">
                        {/* <img
                            src={userData.photoURL || "default-avatar.png"}
                            alt="Profile"
                            className="h-32 w-32 object-cover rounded-full"
                        /> */}
                        <div >
                            <Person className="h-32 w-32 object-cover rounded-full"/>
                        </div>
                        <label
                            htmlFor="file-upload"
                            className="absolute bottom-0 right-0 bg-black text-white rounded-full p-2 cursor-pointer"
                            onClick={handleActionClick}
                        >
                            <Plus />
                        </label>
                        <input
                            type="file"
                            id="file-upload"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleProfileImageChange}
                        />
                    </div>
                    <h2 className="text-xl font-semibold">
                        {userData?.displayName ? capitalizeFirstLetter(userData.displayName) : "Name not set"}
                    </h2>
                    <p className="text-xs lg:text-sm text-gray-600">{user?.email}</p>

                    {/* Edit Name */}
                    <div className="mt-4 w-full max-w-md">
                        <label className="text-sm text-gray-600" htmlFor="name">Name</label>
                        <div className="flex gap-2">
                            <input
                                className="ring-1 ring-gray-300 rounded-sm p-2 w-full"
                                type="text"
                                id="name"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder={`${userData?.displayName || 'Enter your name'}`}
                                onClick={handleActionClick}
                            />
                            <button
                                className="bg-black text-white rounded-sm p-2"
                                onClick={(e) => { handleNameChange(e); handleActionClick(e); }}
                            >
                                <Pencil />
                            </button>
                        </div>
                    </div>

                    {/* Edit Email */}
                    <div className="mt-4 w-full max-w-md">
                        <label className="text-sm text-gray-600" htmlFor="email">Email</label>
                        <div className="flex gap-2">
                            <input
                                className="ring-1 ring-gray-300 rounded-sm p-2 w-full"
                                type="email"
                                id="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                placeholder={`${userData?.email || 'Enter your email'}`}
                                onClick={handleActionClick}
                            />
                            <button
                                className="bg-black text-white rounded-sm p-2"
                                onClick={(e) => { handleEmailChange(e); handleActionClick(e); }}
                            >
                                <Pencil />
                            </button>
                        </div>
                    </div>

                    {/* Reset Password */}
                    <button
                        className="mt-4 bg-black text-white p-2 rounded-sm text-sm mb-3"
                        onClick={(e) => { user ? handlePasswordReset() : handleActionClick(e); }}
                    >
                        Password Reset
                    </button>

                </div>

                {/* Login Popup */}
                {showLoginPopup && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-sm w-80">
                            <h2 className="text-lg font-semibold mb-4">Please Log In</h2>
                            <p className="text-sm mb-4">You need to be logged in to perform this action.</p>
                            <button
                                className="bg-black text-white rounded-sm p-2 w-full"
                                onClick={handlePopupClose} // Close the popup
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
