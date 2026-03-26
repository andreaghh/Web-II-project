import AuthForm from "../components/AuthForm";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const handleRegister = async (data) => {
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (res.ok) {
                alert("Registered successfully!");
                navigate("/login");
            } else {
                alert(result.error || "Registration failed");
            }
        } catch (err) {
            alert("Server error: " + err.message);
        }
    };

    return (
        <div className="login-page">
            <div className="login-wrapper">
                <h1 className="login-title">Create Your Uni-Transport Account</h1>
                <div className="login-card">
                    <h2>Register</h2>
                    <AuthForm onSubmit={handleRegister} type="register" />
                    <p>
                        Already have an account? <a href="/login">Login here</a>
                    </p>
                </div>
            </div>
        </div>
    );

}
