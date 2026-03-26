import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

export function PrivateRoute({ children, role }) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/" />;
    return children;
}

export function PublicRoute({ children }) {
    const { user } = useAuth();
    if (user) return <Navigate to="/" />;
    return children;
}

export function SmartRedirect() {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" />;
    if (user.role === "admin") return <Navigate to="/admin" />;
    return <Navigate to="/bookings" />;
}
