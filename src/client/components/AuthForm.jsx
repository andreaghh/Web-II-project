import { useState } from "react";

export default function AuthForm({ onSubmit, type = "login" }) {
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        password: "",
        role: "student",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form" id="auth-form">
            <input
                id="auth-email"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            {type === "register" && (
                <>
                    <input
                        id="auth-name"
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <select
                        id="auth-role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="student">Student</option>
                        <option value="staff">Staff</option>
                        <option value="professor">Professor</option>
                    </select>
                </>
            )}
            <input
                id="auth-password"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <button id="auth-submit" type="submit">
                {type === "register" ? "Register" : "Login"}
            </button>
        </form>
    );
}