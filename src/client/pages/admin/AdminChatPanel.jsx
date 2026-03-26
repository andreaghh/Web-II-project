import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000", {
    withCredentials: true,
    auth: { role: "admin" }
});

export default function AdminChatPanel() {
    const [chatSessions, setChatSessions] = useState({});
    const [activeUserId, setActiveUserId] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [unreadUsers, setUnreadUsers] = useState(new Set());
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        fetch("/api/admin/chats", { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                const sessions = {};
                const unreadSet = new Set();

                data.forEach(chat => {
                    sessions[chat.userId] = {
                        userName: chat.userName,
                        messages: chat.messages
                    };

                    const lastMessage = chat.messages[chat.messages.length - 1];
                    if (lastMessage && lastMessage.sender === "user") {
                        unreadSet.add(chat.userId);
                    }
                });

                setChatSessions(sessions);
                setUnreadUsers(unreadSet);
            })
            .catch(err => console.error("Failed to fetch chats", err));

        socket.on("adminNotify", ({ userId, userName, sender, text }) => {
            setChatSessions(prev => {
                const existing = prev[userId]?.messages || [];
                return {
                    ...prev,
                    [userId]: {
                        userName,
                        messages: [...existing, { sender, text }]
                    }
                };
            });

            if (sender === "user") {
                playNotificationSound();

                setUnreadUsers(prev => {
                    const updated = new Set(prev);
                    updated.add(userId);
                    return updated;
                });

                if (Notification.permission === "granted") {
                    new Notification(`New message from ${userName}`, { body: text });
                }
            }
        });

        return () => {
            socket.off("adminNotify");
        };
    }, []);

    useEffect(() => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [chatSessions, activeUserId]);

    const playNotificationSound = () => {
        const audio = new Audio("/ping.mp3");
        audio.play().catch(err => console.error("Sound play failed:", err));
    };

    const scrollToBottom = () => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleSend = () => {
        if (!newMessage.trim() || !activeUserId) return;

        socket.emit("sendMessage", {
            userId: activeUserId,
            userName: chatSessions[activeUserId].userName,
            sender: "admin",
            text: newMessage
        });


        setNewMessage("");
    };

    const openChat = (userId) => {
        setActiveUserId(userId);

        setUnreadUsers(prev => {
            const updated = new Set(prev);
            updated.delete(userId);
            return updated;
        });
    };

    return (
        <div className="admin-chat-panel">
            <h2>Admin Support Chat</h2>

            <div className="chat-layout">
                <aside className="chat-users">
                    <h4>Active Users</h4>
                    <ul>
                        {Object.entries(chatSessions).map(([userId, session]) => (
                            <li
                                key={userId}
                                className={activeUserId === userId ? "active" : ""}
                                onClick={() => openChat(userId)}
                                style={{ position: "relative", cursor: "pointer" }}
                            >
                                {session.userName}
                                {unreadUsers.has(userId) && (
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: "8px",
                                            height: "8px",
                                            backgroundColor: "red",
                                            borderRadius: "50%",
                                            marginLeft: "8px"
                                        }}
                                    ></span>
                                )}
                            </li>
                        ))}
                    </ul>
                </aside>

                <section className="chat-window">
                    {activeUserId ? (
                        <>
                            <div className="chat-history" style={{ height: "300px", overflowY: "auto" }}>
                                {chatSessions[activeUserId]?.messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={msg.sender === "admin" ? "admin-msg" : "user-msg"}
                                    >
                                        <strong>{msg.sender}:</strong> {msg.text}
                                    </div>
                                ))}
                                <div ref={endOfMessagesRef}></div>
                            </div>

                            <div className="chat-input">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a response..."
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                />
                                <button onClick={handleSend}>Send</button>
                            </div>
                        </>
                    ) : (
                        <p>Select a user to view messages</p>
                    )}
                </section>
            </div>
        </div>
    );
}
