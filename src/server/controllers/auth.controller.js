import { User } from "../models/index.js";
import { hashPassword, comparePasswords } from "../utils/hash.js";
import jwt from "jsonwebtoken";
import {sendPasswordResetEmail} from "../utils/email.util.js";
import crypto from "crypto";
// REGISTER
export const register = async (req, res) => {
    try {
        //console.log("Register request body:", req.body); // Log incoming data

        const { email, name, password, role = "student" } = req.body;

        const allowedRoles = ["student", "staff", "professor"];
        const userRole = allowedRoles.includes(role) ? role : "student";

        const existing = await User.findOne({ where: { email } });
        if (existing) {
            //console.log("Email already exists");
            return res.status(400).json({ error: "Email already exists." });
        }

        const hashed = await hashPassword(password);

        const user = await User.create({
            email,
            name,
            password: hashed,
            role: userRole,
        });

        //console.log("User created:", user.id);

        req.session.user = { id: user.id, role: user.role };
        res.status(201).json({
            message: "User registered",
            user: { id: user.id, email: user.email, role: user.role },
        });
    } catch (err) {
        console.error("Registration ERROR:", err);
        res.status(500).json({ error: "Registration failed", details: err.message });
    }
};

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await comparePasswords(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };

        // Optionally issue JWT for frontend use
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "2h" });

        res.json({
            message: "Login successful",
            user: { id: user.id, email: user.email, role: user.role },
            token,
        });
    } catch (err) {
        res.status(500).json({ error: "Login failed", details: err.message });
    }
};

// LOGOUT
export const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: "Logout failed" });
        res.clearCookie("connect.sid"); // optional
        res.json({ message: "Logged out" });
    });
};

export const currentUser = async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "Not authenticated" });

    const user = await User.findByPk(req.session.user.id, {
        attributes: ["id", "name", "email", "role"],
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
};

export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ error: "User not found" });

        const token = crypto.randomBytes(32).toString("hex");
        const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        user.reset_token = token;
        user.reset_token_expiry = expiry;
        await user.save();

        try {
            await sendPasswordResetEmail(email, token);
            res.json({ message: "Reset email sent" });
        } catch (emailErr) {
            console.error("Nodemailer failed:", emailErr);
            res.status(500).json({ error: "Failed to send reset email", details: emailErr.message });
        }
    } catch (err) {
        console.error("Error in reset controller:", err); // fallback
        res.status(500).json({ error: "Unexpected error", details: err.message });
    }
};
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({ where: { reset_token: token } });

        if (!user || !user.reset_token_expiry || user.reset_token_expiry < new Date()) {
            return res.status(400).json({ error: "Token is invalid or expired" });
        }

        // Hash new password
        const hashed = await hashPassword(password);
        user.password = hashed;
        user.reset_token = null;
        user.reset_token_expiry = null;

        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ error: "Reset failed", details: err.message });
    }
};