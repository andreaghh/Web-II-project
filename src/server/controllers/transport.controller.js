import { TransportType, Transport, Booking } from "../models/index.js";
import { Op } from "sequelize";

// GET /api/transports/types
export const getTransportTypes = async (req, res) => {
    try {
        const types = await TransportType.findAll();
        res.json(types);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch transport types" });
    }
};


// GET /api/transports/vehicles
export const getVehicles = async (req, res) => {
    try {
        const vehicles = await Transport.findAll({ include: ["TransportType"] });
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch vehicles" });
    }
};

// POST /api/transports/vehicles
export const createTransport = async (req, res) => {
    const { type_id, vehicle_identifier, status } = req.body;
    try {
        const newVehicle = await Transport.create({ type_id, vehicle_identifier, status });
        res.status(201).json(newVehicle);
    } catch (err) {
        res.status(500).json({ error: "Failed to create vehicle" });
    }
};

//Get disponibilidad
export const getAvailability = async (req, res) => {
    const { type_id, departure, return: returnTime } = req.query;

    if (!type_id || !departure || !returnTime) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    try {
        const allVehicles = await Transport.findAll({ where: { type_id } });

        const overlappingBookings = await Booking.findAll({
            where: {
                type_id,
                [Op.or]: [
                    {
                        departure_time: { [Op.lt]: new Date(returnTime) },
                        return_time: { [Op.gt]: new Date(departure) },
                    },
                ],
                status: { [Op.in]: ["pending", "approved"] },
            },
        });

        const bookedVehicleCount = overlappingBookings.reduce(
            (sum, b) => sum + b.vehicle_count,
            0
        );

        const available = allVehicles.length - bookedVehicleCount;

        res.json({ available });
    } catch (err) {
        console.error("Availability check failed:", err);
        res.status(500).json({ error: "Server error" });
    }
};
