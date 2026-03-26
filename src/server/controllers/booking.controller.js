import { Booking, TransportType, User, Transport, BookingTransport } from "../models/index.js";
import { Op } from "sequelize";



// POST /api/bookings/
export const createBooking = async (req, res) => {
    const {
        transport_type_id,
        quantity,
        reason,
        departure_time,
        return_time,
    } = req.body;

    const file = req.file;
    const type_id = transport_type_id;
    const vehicle_count = Number(quantity);
    const user_id = req.session?.user?.id;

    if (!user_id) return res.status(401).json({ error: "Unauthorized. No session user." });

    if (!type_id || !vehicle_count || !reason || !departure_time || !return_time || !file) {
        return res.status(400).json({ error: "All fields are required, including the justification file." });
    }

    if (!Number.isInteger(vehicle_count) || vehicle_count < 1 || vehicle_count > 10) {
        return res.status(400).json({ error: "You can only book between 1 and 10 vehicles." });
    }

    const departure = new Date(departure_time);
    const returnT = new Date(return_time);
    const now = new Date();

    if (isNaN(departure) || isNaN(returnT)) return res.status(400).json({ error: "Invalid date format." });
    if (departure >= returnT) return res.status(400).json({ error: "Return time must be after departure time." });
    if (departure < now) return res.status(400).json({ error: "Departure time must be in the future." });

    try {
        const allVehicles = await Transport.findAll({ where: { type_id } });
        if (allVehicles.length === 0) {
            return res.status(400).json({ error: "No vehicles of this type exist" });
        }

        const overlappingBookings = await Booking.findAll({
            where: {
                type_id,
                [Op.or]: [
                    {
                        departure_time: { [Op.lt]: returnT },
                        return_time: { [Op.gt]: departure },
                    },
                ],
                status: { [Op.in]: ["pending", "approved"] },
            },
        });

        const bookedVehicleCount = overlappingBookings.reduce(
            (sum, b) => sum + b.vehicle_count,
            0
        );

        const availableVehicles = allVehicles.length - bookedVehicleCount;

        if (availableVehicles < vehicle_count) {
            return res.status(400).json({
                error: `Only ${availableVehicles} vehicle(s) available. Reduce quantity or change time.`,
            });
        }

        // Step 1: Find actual available transports
        const availableTransports = await Transport.findAll({
            where: {
                type_id,
                status: "available"
            },
            limit: vehicle_count
        });

        if (availableTransports.length < vehicle_count) {
            return res.status(400).json({ error: "Not enough available vehicles found." });
        }

        // Step 2: Create the booking
        const newBooking = await Booking.create({
            user_id,
            type_id,
            vehicle_count,
            reason,
            departure_time,
            return_time,
            justification_path: file.path,
            status: "pending",
        });

        // Step 3: Assign vehicles
        for (const transport of availableTransports) {
            await BookingTransport.create({
                booking_id: newBooking.id,
                transport_id: transport.id,
            });

            transport.status = "booked";
            await transport.save();
        }

        //  Step 4: Emit real-time event to admins
        const io = req.app.get('io');
        if (io) {
            io.to("admin-room").emit("newBooking", {
                id: newBooking.id,
                userName: req.session.user.name,
                reason: newBooking.reason,
                departure_time: newBooking.departure_time,
                return_time: newBooking.return_time,
                status: newBooking.status
            });
        }

        res.status(201).json({ message: "Booking created and vehicles assigned.", booking: newBooking });

    } catch (err) {
        console.error("Booking creation failed:", err);
        res.status(500).json({ error: "Booking failed", details: err.message });
    }
};


// GET /api/bookings/mine
export const getMyBookings = async (req, res) => {
    const userId = req.session.user.id;
    const {
        status,
        start_date,
        end_date,
        sort_by = "departure_time",
        order = "DESC"
    } = req.query;

    const where = { user_id: userId };

    if (status) {
        where.status = status;
    }

    if (start_date && end_date) {
        where.departure_time = {
            [Op.between]: [new Date(start_date), new Date(end_date)],
        };
    }

    try {
        const bookings = await Booking.findAll({
            where,
            include: [TransportType],
            order: [[sort_by, order.toUpperCase()]],
        });

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: "Failed to get bookings" });
    }
};


// PUT /api/bookings/:id/cancel
export const cancelBooking = async (req, res) => {
    const bookingId = req.params.id;
    const userId = req.session.user.id;
    const userRole = req.session.user.role;

    try {
        const booking = await Booking.findByPk(bookingId);

        if (!booking) return res.status(404).json({ error: "Booking not found" });

        // Only allow cancel if user owns the booking or is admin
        if (booking.user_id !== userId && userRole !== "admin") {
            return res.status(403).json({ error: "Not allowed to cancel this booking" });
        }

        if (["cancelled", "denied"].includes(booking.status.toLowerCase())) {
            return res.status(400).json({ error: `Cannot cancel a ${booking.status} booking.` });
        }

        // Free assigned vehicles
        const assignedTransports = await BookingTransport.findAll({ where: { booking_id: bookingId } });

        for (const assignment of assignedTransports) {
            const transport = await Transport.findByPk(assignment.transport_id);
            if (transport) {
                transport.status = "available";
                await transport.save();
            }
        }

        booking.status = "cancelled";
        await booking.save();

        res.json({ message: "Booking cancelled and vehicles freed.", booking });
    } catch (err) {
        console.error("Cancel failed:", err);
        res.status(500).json({ error: "Cancel failed", details: err.message });
    }
};


// GET /api/bookings/:id
export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id, {
            include: [
                {
                    model: TransportType,
                    attributes: ["type", "image"],
                },
            ],
        });

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        // Restrict access: only allow owner or admin
        const sessionUser = req.session.user;
        if (sessionUser.role !== "admin" && booking.user_id !== sessionUser.id) {
            return res.status(403).json({ error: "Forbidden: You cannot view this booking" });
        }

        res.json(booking);
    } catch (err) {
        console.error("Failed to fetch booking:", err);
        res.status(500).json({ error: "Server error" });
    }
};

