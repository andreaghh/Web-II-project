import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <strong>🚐 UniTransport</strong>
            </div>
            <div className="navbar-links">
                <NavLink
                    to="/bookings"
                    end
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                    Home
                </NavLink>
                <NavLink
                    to="/bookings/new"
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                    Book
                </NavLink>
                {user.role === "admin" && (
                    <NavLink
                        to="/admin"
                        className={({ isActive }) => (isActive ? "active-link" : "")}
                    >
                        Admin
                    </NavLink>
                )}
                <span className="navbar-user">{user.name} ({user.role})</span>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
        </nav>
    );
}
