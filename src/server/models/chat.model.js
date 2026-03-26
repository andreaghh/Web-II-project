import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    sender: String, // "user" or "admin"
    text: String,
    timestamp: { type: Date, default: Date.now }
});

const ChatSchema = new mongoose.Schema({
    userId: Number, // Sequelize User ID
    userName: String,
    messages: [MessageSchema]
});

export default mongoose.model("Chat", ChatSchema);
