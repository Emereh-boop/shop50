// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "ecommerce-webapp-000.firebaseapp.com",
  databaseURL: "https://ecommerce-webapp-000-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ecommerce-webapp-000",
  storageBucket: "ecommerce-webapp-000.appspot.com",
  messagingSenderId: process.env.MESSEGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: "G-S7CH4EMK5H"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// const appCheck = initializeAppCheck(app, {
//   provider: new ReCaptchaV3Provider("reCAPTCHA"),
//   isTokenAutoRefreshEnabled: true,
// });
