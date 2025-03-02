import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth/context";
import { Load } from "../components/common/loading";

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <Load />;

  console.log("Checking user role:", user); // Debugging

  return user?.role === "admin" ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
