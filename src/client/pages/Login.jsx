import AuthForm from "../components/AuthForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleLogin = async (data) => {
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (res.ok) {

                const meRes = await fetch("/api/auth/me", { credentials: "include" });
                const meData = await meRes.json();

                if (meRes.ok) {
                    setUser(meData.user);
                }

                alert("Login successful!");
                navigate("/bookings");
            } else {
                alert(result.error || "Login failed");
            }
        } catch (err) {
            alert("Server error: " + err.message);
        }
    };

    return (
        <div className="login-page">
            <div className="login-wrapper">
                <h1 className="login-title">Welcome to Uni-Transport</h1>
                <div className="login-card">
                    <h2>Login</h2>
                    <AuthForm onSubmit={handleLogin} />
                    <p>
                        Don't have an account? <a href="/register">Register here</a>
                    </p>
                    <p>
                        Forgot your password? <a href="/forgot-password">Reset here</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
