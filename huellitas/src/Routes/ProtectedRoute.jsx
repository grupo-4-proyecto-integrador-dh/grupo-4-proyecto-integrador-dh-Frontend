import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/Auth.Context";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { state, loading } = useAuth();

  if (loading) return <div className="loading-message">Cargando...</div>;

  if (!state.user || !allowedRoles.includes(state.user.rol)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
