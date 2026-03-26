import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ResetPassword() {
    const {token} = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`/api/auth/reset-password/${token}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({password}),
        });

        const data = await res.json();
        if (res.ok) {
            setMessage("Password reset! Redirecting...");
            setTimeout(() => navigate("/login"), 2000);
        } else {
            setMessage(` ${data.error}`);
        }
    };

    return (
        <div className="auth-bg">
            <div className="auth-card">
                <h1 className="auth-title">Reset Your Password</h1>
                <p className="auth-subtext">Enter your new password below.</p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <input
                        type="password"
                        placeholder="New password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Reset Password</button>
                </form>

                {message && <p className="auth-message">{message}</p>}
            </div>
        </div>
    );
}
