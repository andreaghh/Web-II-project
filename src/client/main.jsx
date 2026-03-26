 import React from "react";
    import ReactDOM from "react-dom/client";
    import App from "./App";
    import { AuthProvider, useAuth } from "./context/AuthContext";
    import { SocketProvider } from "./context/SocketContext";

    // This component waits for the auth to load before starting the socket
    const AppWithSocket = () => {
        const { user, loading } = useAuth();

        if (loading) return <p>Loading session...</p>;

        return (
            <SocketProvider user={user}>
                <App />
            </SocketProvider>
        );
    };

    ReactDOM.createRoot(document.getElementById("root")).render(
        <React.StrictMode>
            <AuthProvider>
                <AppWithSocket />
            </AuthProvider>
        </React.StrictMode>
    );
