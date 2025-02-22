import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth/context";

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  console.log("Checking user role:", user); // Debugging

  return user?.role === "admin" ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default AdminRoute;
