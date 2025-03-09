import { createContext, useContext, useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const userRef = doc(db, "users", firebaseUser.uid);
            const userSnap = await getDoc(userRef);

            let userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || "",
              role: "user", // Default role
            };

            if (userSnap.exists()) {
              userData = { ...userData, ...userSnap.data() }; // Merge Firestore data
            } else {
              // Store new user in Firestore
              await setDoc(userRef, userData, { merge: true });
            }

            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData)); // Store full user object
          } else {
            setUser(null);
            localStorage.removeItem("user");
          }
          setLoading(false);
        });

        return () => unsubscribe();
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [auth, db]);

  const register = async (email, password, displayName) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const adminRef = doc(db, "adminList", user.uid); // Check if user is pre-approved as admin
      const adminSnap = await getDoc(adminRef);

      const role = adminSnap.exists() ? "admin" : "user"; // If found in Firestore, assign as admin

      const newUser = {
        uid: user.uid,
        email,
        displayName,
        role,
      };

      await setDoc(doc(db, "users", user.uid), newUser);

      setUser(newUser); // Ensure `user` is updated
      localStorage.setItem("user", JSON.stringify(newUser));

      return user;
    } catch (error) {
      return null;
    }
  };

  const login = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUser(userData); // Update user state with Firestore data
        localStorage.setItem("user", JSON.stringify(userData)); // Store updated data in localStorage
        return userData;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const { user } = await signInWithPopup(auth, provider);

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      let userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        role: "user",
      };

      if (userSnap.exists()) {
        userData = { ...userData, ...userSnap.data() }; // Merge Firestore data
      } else {
        await setDoc(userRef, userData, { merge: true });
      }

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return userData;
    } catch (error) {
      return null;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, register, login, googleSignIn, logout, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
