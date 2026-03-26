import express from "express";
import {requireAdmin, requireAuth} from "../middleware/auth.middleware.js";
import {
    deleteUser, deleteTransportType, deleteTransport, createTransportType, createTransport, getAllBookings,
    approveBooking, getAllUsers, promoteToAdmin, denyBooking, getTransports, getTransportTypes, getAllChats
} from "../controllers/admin.controller.js";
import {getDashboardStats} from "../controllers/admin.controller.js";
import {cancelBooking} from "../controllers/booking.controller.js";

const router = express.Router();

// Users
router.get("/users", requireAdmin, getAllUsers);
router.delete("/users/:id", requireAdmin, deleteUser);
router.put("/users/:id/promote", requireAdmin, promoteToAdmin);

// Transport creation
router.post("/transport-types", requireAdmin, createTransportType);
router.post("/transports", requireAdmin, createTransport);
router.delete("/transport-types/:id", requireAdmin, deleteTransportType);
router.delete("/transports/:id", requireAdmin, deleteTransport);
router.get("/types",requireAdmin, getTransportTypes);
router.get("/vehicles",requireAdmin, getTransports);

// Booking management
router.get("/bookings", requireAdmin, getAllBookings);
router.put("/bookings/:id/approve", requireAdmin, approveBooking);
router.put("/bookings/:id/deny", requireAdmin, denyBooking);
router.put("/bookings/:id/cancel", requireAdmin, cancelBooking);

router.get("/dashboard", requireAdmin, getDashboardStats);
router.get("/chats", requireAuth, requireAdmin, getAllChats);

export default router;
