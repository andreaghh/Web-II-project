import { useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const socket = io("http://localhost:3000", {
    withCredentials: true,
    auth: { role: "admin" }
});

export default function AdminNotificationHandler() {
    const { user } = useAuth();

    useEffect(() => {
        if (!user || user.role !== "admin") return;

        socket.on("adminNotify", ({ userName, text }) => {
            // Play notification sound
            const audio = new Audio("/ping.mp3");
            audio.play().catch((err) => console.error("Sound play failed:", err));

            // Show browser notification
            if (Notification.permission === "granted") {
                new Notification(`New message from ${userName}`, { body: text });
            }
        });

        return () => {
            socket.off("adminNotify");
        };
    }, [user]);

    useEffect(() => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    return null; // It does not render anything visible
}
