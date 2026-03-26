import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PrivateRoute, PublicRoute, SmartRedirect } from "./RouteGuards";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import BookNew from "./pages/BookNew.jsx";
import BookingDetails from "./pages/BookingDetails.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminBookings from "./pages/admin/AdminBookings.jsx";
import AdminTransport from "./pages/admin/AdminTransport.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import FloatingChat from "./components/FloatingChat.jsx";
import { useAuth } from "./context/AuthContext";
import AdminChatPanel from "./pages/admin/AdminChatPanel.jsx";
import AdminNotificationHandler from "./components/AdminNotificationHandler.jsx";

export default function App() {
    const { user } = useAuth(); // current user from AuthContext

    return (
        <Router>
            <Navbar />
            {user && user.role === "admin" && <AdminNotificationHandler />}

            {/* Show FloatingChat only for logged-in non-admin users */}
            {user && user.role !== "admin" && <FloatingChat />}



            <Routes>
                <Route path="/" element={<SmartRedirect />} />

                <Route path="/forgot-password" element={
                    <PublicRoute>
                        <ForgotPassword />
                    </PublicRoute>
                }/>

                <Route path="/reset-password/:token" element={
                    <PublicRoute>
                        <ResetPassword />
                    </PublicRoute>
                }/>

                <Route path="/login" element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }/>

                <Route path="/register" element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }/>

                <Route path="/bookings" element={
                    <PrivateRoute>
                        <MyBookings />
                    </PrivateRoute>
                }/>

                <Route path="/bookings/new" element={
                    <PrivateRoute>
                        <BookNew />
                    </PrivateRoute>
                }/>

                <Route path="/bookings/:id" element={
                    <PrivateRoute>
                        <BookingDetails />
                    </PrivateRoute>
                }/>

                <Route path="/admin/users" element={
                    <PrivateRoute role="admin">
                        <AdminUsers />
                    </PrivateRoute>
                }/>

                <Route path="/admin" element={
                    <PrivateRoute role="admin">
                        <AdminDashboard />
                    </PrivateRoute>
                }/>

                <Route path="/admin/bookings" element={
                    <PrivateRoute role="admin">
                        <AdminBookings />
                    </PrivateRoute>
                }/>

                <Route path="/admin/transports" element={
                    <PrivateRoute role="admin">
                        <AdminTransport />
                    </PrivateRoute>
                }/>
                <Route
                    path="/admin/support"
                    element={
                        <PrivateRoute role="admin">
                            <AdminChatPanel />
                        </PrivateRoute>
                    }
                />

            </Routes>
        </Router>
    );
}
