import express from "express";
import {getAvailability, getTransportTypes, getVehicles,} from "../controllers/transport.controller.js";
import {requireAuth} from "../middleware/auth.middleware.js";


const router = express.Router();

router.get("/types", getTransportTypes);
router.get("/vehicles", getVehicles);
router.get("/availability", requireAuth, getAvailability);
export default router;
