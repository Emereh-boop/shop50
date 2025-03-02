import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth/context";
import LoginModal from "../pages/auth/Login";
import { useState } from "react";

const PrivateRoute = () => {
  const { user, loading } = useAuth(); // Ensure loading state is checked
  const [showLogin, setShowLogin] = useState(false);

  if (loading) return <div>Loading...</div>; // Prevent redirect before auth is ready
  return user ? <Outlet /> : <LoginModal isOpen={showLogin} setIsOpen={setShowLogin} onClose={() => setShowLogin(false)} />;
};

export default PrivateRoute;
