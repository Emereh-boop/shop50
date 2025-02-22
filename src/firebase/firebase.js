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
  apiKey: "AIzaSyB6AO3OgAGub5iUFOS24VQqY0wnrpHMdkQ",
  authDomain: "ecommerce-webapp-000.firebaseapp.com",
  projectId: "ecommerce-webapp-000",
  storageBucket: "ecommerce-webapp-000.appspot.com",
  messagingSenderId: "73693645683",
  appId: "1:73693645683:web:ce0ec7bbf0f4bce0bdd306",
  measurementId: "G-JXZBK2TW1R",
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
