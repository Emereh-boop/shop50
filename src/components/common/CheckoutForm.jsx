// components/CheckoutForm.js
import React, { useEffect, useState } from "react";
import { useUser } from "../../context/user/context"; // Importing context to access user data
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useShipping } from "../../context/shipping/context";

const countries = [
    { name: "United States", cities: ["New York", "Los Angeles", "Chicago"] },
    { name: "Canada", cities: ["Toronto", "Montreal", "Vancouver"] },
    { name: "United Kingdom", cities: ["London", "Manchester", "Birmingham"] },
    { name: "Nigeria", cities: ["Abuja", "Lagos", "Port-Harcourt"] },
];
const CheckoutForm = ({
    cart,
    remove,
    handleSubmit,
    setName,
    setEmail,
    setAddress,
    name,
    tel,
    setTel,
    deliveryMethod,
    setDeliveryMethod,
    lastName,
    setLastName,
    shippingData,
    email,
    address,
    zipCode,
    setZipCode,
    selectedCity,
    setSelectedCity,
    selectedCountry,
    setSelectedCountry,
    paid,
}) => {
    const { userData } = useUser();
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPhoneValid, setIsPhoneValid] = useState(true);
    const [isZipCodeValid, setIsZipCodeValid] = useState(true);
    const [showPayWarn, setShowPayWarn] = useState(false);

    // Update user data on component mount
    useEffect(() => {
        if (userData) {
            setName(userData.displayName || "");
            setEmail(userData.email || "");
        }
    }, [userData, setEmail, setName]);

    // Helper functions for validation
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^[0-9]{11}$/; // Assuming a 11-digit phone number
        return phoneRegex.test(phone);
    };

    const validateZipCode = (zip) => {
        const zipRegex = /^[0-9]{6}$/; // Assuming a 5-digit zip code
        return zipRegex.test(zip);
    };

    const handleSubmitValidation = (event) => {
        event.preventDefault();

        // Validate fields before submitting
        const emailValid = validateEmail(email);
        const phoneValid = validatePhone(tel);
        const zipCodeValid = validateZipCode(zipCode);

        if (!emailValid) setIsEmailValid(false);
        if (!phoneValid) setIsPhoneValid(false);
        if (!zipCodeValid) setIsZipCodeValid(false);
        if (!paid) setShowPayWarn(true);

        if (emailValid && phoneValid && zipCodeValid && paid) {
            handleSubmit(event); // Call the submit handler if everything is valid
        }
    };


    return (
        <>
           {/* {paid && <div
        className={`fixed top-30 left-1/2 transform z-[9999] -translate-x-1/2 p-3 text-white rounded-md shadow-md bg-red-500`}
        style={{ zIndex: 9999 }}
      >
        Please make payments before checking out
      </div>} */}
            <div className="mb-6">
                <div className="flex  overflow-x-auto scroll-smooth scrollbar-hide gap-2 snap-x snap-mandatory">
                    {cart.length === 0 ? (
                        <p className="text-xs text-gray-400">No products in cart.</p>
                    ) : (
                        cart.map((product) => (
                            <div key={product.id} className="flex py-4 gap-2 shadow-sm">
                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-100">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.title}
                                        className="h-full w-full object-cover object-center"
                                    />
                                </div>

                                <div className="text-sm w-20 truncate overflow-hidden font-medium text-gray-900">
                                    <div className="items-start flex flex-col">
                                        <a
                                            className="text-ellipsis"
                                            href={`/product/${product.id}`}
                                        >
                                            {product.title}
                                        </a>
                                        <p className="text-gray-500">x{product.qty}</p>
                                        <XMarkIcon
                                            className="h-4 w-4"
                                            onClick={() => remove(product.id)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <span className="text-xs flex justify-end md:text-sm text-blue-500">
                    scroll to see more
                </span>
            </div>
            <form onSubmit={handleSubmitValidation} className="space-y-6">
                <div className="text-red-500 text-sm">
                    {name === "" ? "* indicates required field" : ""}
                </div>
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            placeholder="Type here"
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 block w-full p-3 border-gray-700 rounded-sm shadow-sm focus:ring-black focus:border-black"
                        />
                    </div>
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={lastName}
                            placeholder="Type here"
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="mt-1 block w-full p-3 border-gray-900 rounded-sm shadow-sm focus:ring-black focus:border-black"
                        />
                    </div> */}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={tel}
                            placeholder="Type here"
                            onChange={(e) => setTel(e.target.value)}
                            required
                            className="mt-1 block w-full p-3 border-gray-900 rounded-sm shadow-sm focus:ring-black focus:border-black"
                        />
                        {!isPhoneValid && <p className="text-red-500">Invalid phone number.</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            placeholder="Type here"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full p-3 border-gray-900 rounded-sm shadow-sm focus:ring-black focus:border-black"
                        />
                        {!isEmailValid && <p className="text-red-500">Invalid email address.</p>}
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Street Address, City, Zip Code (e.g., 123 Main St, New York, 10001)"
                            className="mt-1 block w-full p-3 border-gray-900 rounded-sm shadow-sm focus:ring-black focus:border-black"
                            value={address}
                            required
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Zip Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., 12345"
                                className="mt-1 block w-full p-3 border-gray-900 rounded-sm shadow-sm focus:ring-black focus:border-black"
                                value={zipCode}
                                required
                                onChange={(e) => setZipCode(e.target.value)}
                            />
                            {!isZipCodeValid && <p className="text-red-500">Invalid zip code.</p>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Country <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="mt-1 block w-full p-3 rounded-sm shadow-sm focus:ring-black focus:border-black"
                            value={selectedCountry}
                            required
                            onChange={(e) => setSelectedCountry(e.target.value)}
                        >
                            <option value="">Select Country</option>
                            {shippingData?.map((country) => (
                                <option key={country.id} value={country.name}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            City <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="mt-1 block w-full p-3 rounded-sm shadow-sm focus:ring-black focus:border-black"
                            value={selectedCity}
                            required
                            onChange={(e) => setSelectedCity(e.target.value)}
                        >
                            <option value="">Select City</option>
                            {selectedCountry &&
                                shippingData
                                    .find((c) => c.name === selectedCountry)
                                    ?.cities.map((city) => (
                                        <option key={city.name} value={city.name}>
                                            {city.name}
                                        </option>
                                    ))}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Select Delivery Method <span className="text-red-500">*</span>
                    </label>
                    <select
                        className="mt-1 block p-3 w-1/2 rounded-sm shadow-sm focus:ring-black focus:border-black"
                        value={deliveryMethod}
                        required
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                    >
                        <option value="">select method</option>
                        <option value="standard">Standard (3-5 days)</option>
                        <option value="Expedited">Expedited (1-2 days)</option>
                        <option value="pickup">Local Pickup (Today)</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Message to seller
                        </label>
                        <textarea
                            className="mt-1 block w-full p-3 border-gray-900 rounded-sm shadow-sm focus:ring-black focus:border-black"
                            rows="2"
                            placeholder="Your Feedback"
                        ></textarea>
                    </div>
                </div>
                {showPayWarn && <p className="text-orange-500">Please complete payments</p>}
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => (window.location.href = "/")}
                        className="bg-gray-200 text-gray-700 px-6 py-3 rounded-sm focus:outline-none hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-black text-white px-6 py-3 rounded-sm focus:outline-none hover:bg-gray-800"
                    >
                        Continue
                    </button>
                </div>
            </form>   </>
    );
};

export default CheckoutForm;
