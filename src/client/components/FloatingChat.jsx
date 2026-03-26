import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import pingSound from "/ping.mp3";

const socket = io("http://localhost:3000", {
    withCredentials: true,
});

export default function FloatingChat() {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [unread, setUnread] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        if (!user) return;

        socket.emit("join", {
            userId: user.id,
            userName: user.name,
        });

        socket.on("newMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);

            if (!open) {
                setUnread(true);
                audioRef.current?.play();
            }
        });

        return () => {
            socket.off("newMessage");
        };
    }, [user, open]);

    const sendMessage = () => {
        if (!input.trim()) return;

        socket.emit("sendMessage", {
            userId: user.id,
            userName: user.name,
            sender: "user",
            text: input,
        });

        setInput("");
    };

    const toggleChat = () => {
        setOpen((prev) => {
            if (!prev) setUnread(false);
            return !prev;
        });
    };

    if (!user || user.role === "admin") return null;

    return (
        <div className="chat-widget">
            <button className="chat-toggle" onClick={toggleChat}>
                💬 Support
                {unread && <span className="chat-dot" />}
            </button>

            {open && (
                <div className="chat-box">
                    <div className="chat-header">
                        <strong>🗨️ Live Support</strong>
                        <button onClick={toggleChat}>✖</button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`chat-msg ${msg.sender}`}>
                                <span>
                                    <strong>{msg.sender === "admin" ? "Admin" : "You"}:</strong> {msg.text}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="chat-input">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            )}

            <audio ref={audioRef} src={pingSound} preload="auto" />
        </div>
    );
}
