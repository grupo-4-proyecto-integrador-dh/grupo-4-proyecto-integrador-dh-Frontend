import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/Auth.Context";

const ProtectedRoute = ({ element }) => {
    const { state } = useAuth();

    console.log("Estado actual en ProtectedRoute:", state);

    // Evitar redirección mientras se carga la sesión
    if (state.user === null) {
        return <div>Cargando...</div>; // O algún spinner
    }

    if (state.user.rol !== "ADMIN") {
        return <Navigate to="/login" replace />;
    }

    return element;
};
;


export default ProtectedRoute;
