import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth/context";

const PrivateRoute = () => {
  const { user, loading } = useAuth(); // Ensure loading state is checked

  if (loading) return <div>Loading...</div>; // Prevent redirect before auth is ready
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
