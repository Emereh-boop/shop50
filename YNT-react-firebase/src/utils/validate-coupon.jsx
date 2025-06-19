// utils/couponValidation.js
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";// Import Firebase

// Function to validate coupon
export const validateCoupon = async (couponCode) => {
  try {
    const couponQuerySnapshot = await getDocs(collection(db, "coupons"));
      const coupons = couponQuerySnapshot.docs.map((doc) => doc.data());
      console.log("firebase coupon:",coupons)

    // Find the coupon that matches the couponCode
    const couponData = coupons.find(
      (coupon) => coupon.code.toLowerCase() === couponCode.toLowerCase()
      );
      console.log("coupon data:",couponData)

    if (!couponData) {
      return { valid: false, message: "Invalid coupon code." };
    }

    const currentDate = new Date();
    const { startDate, endDate, discount } = couponData;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (currentDate < start || currentDate > end) {
      return { valid: false, message: "Coupon has expired or is not valid yet." };
    }

    return { valid: true, discount };
  } catch (error) {
    return { valid: false, message: "An error occurred during coupon validation." };
  }
};
