import express from "express";
import {createBooking, getMyBookings, cancelBooking, getBookingById,} from "../controllers/booking.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import {upload} from "../utils/upload.js";

const router = express.Router();

router.post("/", requireAuth, upload.single("justification"), createBooking);
router.get("/mine", requireAuth, getMyBookings);
router.put("/:id/cancel", requireAuth, cancelBooking);
router.get("/:id", requireAuth, getBookingById);


export default router;
