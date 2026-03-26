import { useState } from "react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/auth/request-password-reset", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (res.ok) {
            setMessage("Email sent! Check your inbox.");
        } else {
            setMessage(` ${data.error}`);
        }
    };

    return (
        <div className="auth-bg">
            <div className="auth-card">
                <h1 className="auth-title">Forgot Password</h1>
                <p className="auth-subtext">Enter your email to receive a reset link.</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    <input
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Send Reset Link</button>
                </form>
                {message && <p className="auth-message">{message}</p>}
                <p style={{ marginTop: "1rem" }}>
                    <a href="/login">← Back to Login</a>
                </p>
            </div>
        </div>
    );
}
