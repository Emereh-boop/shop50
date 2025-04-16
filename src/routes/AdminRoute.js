import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth/context";
import { Load } from "../components/skeletons/loading";

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <Load />;

  return user?.role === "admin" ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
