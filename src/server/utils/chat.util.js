import Chat from "../models/chat.model.js";

export default (io) => {
    io.on("connection", (socket) => {
        // Check if this is an admin
        const isAdmin = socket.handshake.auth?.role === "admin";

        if (isAdmin) {
            socket.join("admin-room"); // Admins join a common admin room
        } else {
            socket.on("join", ({ userId, userName }) => {
                socket.join(`user-${userId}`);
                // console.log(`User ${userName} joined room user-${userId}`);
            });
        }

        // Handle sending messages
        socket.on("sendMessage", async ({ userId, userName, sender, text }) => {
            try {
                let chat = await Chat.findOne({ userId });
                if (!chat) {
                    chat = new Chat({ userId, userName, messages: [] });
                }

                const message = { sender, text };
                chat.messages.push(message);
                await chat.save();

                io.to(`user-${userId}`).emit("newMessage", message);

                io.to("admin-room").emit("adminNotify", {
                    userId,
                    userName,
                    sender,
                    text,
                });


                // console.log(`Message from ${sender}: ${text}`);
            } catch (err) {
                console.error("Error saving or sending chat:", err.message);
            }
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            // console.log("User disconnected:", socket.id);
        });
    });
};
