import express from "express";
import ViteExpress from "vite-express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import { Server as SocketIO } from "socket.io";

// Load environment variables
dotenv.config();

// DB connections
import "./config/db.mysql.js";
import connectMongo from "./config/db.mongo.js";

// Route imports
import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import transportRoutes from "./routes/transport.routes.js";
import adminRoutes from "./routes/admin.routes.js";

// Chat handler
import socketHandler from "./utils/chat.util.js";

// Init Express app
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Sessions stored in MongoDB
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions"
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 2, // 2 hours
    httpOnly: true,
    secure: false,
  },
}));

// Serve uploaded files
app.use("/uploads/justifications", express.static("uploads/justifications"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/transports", transportRoutes);
app.use("/api/admin", adminRoutes);

// Real-time Chat Setup
connectMongo().then(() => {
  const server = ViteExpress.listen(app, process.env.PORT || 3000, () => {
    console.log(` Server running at PORT:${process.env.PORT || 3000}`);
  });

  const io = new SocketIO(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  app.set('io', io);
  // Pass io to handler
  socketHandler(io);
});
