import {User, Booking, TransportType, Transport, BookingTransport} from "../models/index.js";
import Chat from "../models/chat.model.js";
import {sendBookingApprovalEmail} from "../utils/email.util.js";
// USERS
// DELETE user
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        await user.destroy();
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete user" });
    }
};
// GET all users
export const getAllUsers = async (req, res) => {
    const { name, role } = req.query;

    const where = {};
    if (name) {
        where.name = { [Op.like]: `%${name}%` };
    }
    if (role) {
        where.role = role;
    }

    try {
        const users = await User.findAll({
            where,
            attributes: ["id", "email", "name", "role", "createdAt"],
            order: [["createdAt", "DESC"]],
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};
export const promoteToAdmin = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.role === "admin") {
            return res.status(400).json({ error: "User is already an admin" });
        }

        user.role = "admin";
        await user.save();

        res.json({ message: "User promoted to admin", user });
    } catch (err) {
        res.status(500).json({ error: "Failed to promote user", details: err.message });
    }
};


// TRANSPORT TYPES
// GET /api/transports/types
export const getTransportTypes = async (req, res) => {
    try {
        const types = await TransportType.findAll({ order: [["type", "ASC"]] });
        res.json(types);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch transport types" });
    }
};

// GET /api/transports/vehicles
export const getTransports = async (req, res) => {
    try {
        const transports = await Transport.findAll({
            include: { model: TransportType, attributes: ["type", "capacity"] },
            order: [["vehicle_identifier", "ASC"]],
        });
        res.json(transports);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch transport vehicles" });
    }
};
// CREATE transport type
export const createTransportType = async (req, res) => {
    const { type, capacity, image } = req.body;
    try {
        const newType = await TransportType.create({ type, capacity, image });
        res.status(201).json(newType);
    } catch (err) {
        res.status(500).json({ error: "Failed to create transport type" });
    }
};

// DELETE transport type
export const deleteTransportType = async (req, res) => {
    try {
        const type = await TransportType.findByPk(req.params.id);
        if (!type) return res.status(404).json({ error: "Transport type not found" });

        await type.destroy();
        res.json({ message: "Transport type deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete transport type" });
    }
};

// TRANSPORTS (vehicles)

// CREATE physical vehicle
export const createTransport = async (req, res) => {
    const { type_id, vehicle_identifier, status } = req.body;
    try {
        const newVehicle = await Transport.create({ type_id, vehicle_identifier, status });
        res.status(201).json(newVehicle);
    } catch (err) {
        res.status(500).json({ error: "Failed to create vehicle" });
    }
};

// DELETE physical vehicle
export const deleteTransport = async (req, res) => {
    try {
        const transport = await Transport.findByPk(req.params.id);
        if (!transport) return res.status(404).json({ error: "Transport not found" });

        await transport.destroy();
        res.json({ message: "Transport deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete transport" });
    }
};

//BOOKINGS

// GET all bookings
export const getAllBookings = async (req, res) => {
    const { status, user } = req.query;

    const where = {};
    if (status) {
        where.status = status;
    }

    try {
        const bookings = await Booking.findAll({
            where,
            include: [
                {
                    model: User,
                    where: user
                        ? {
                            name: {
                                [Op.like]: `%${user}%`
                            }
                        }
                        : undefined,
                    attributes: ["id", "name", "email", "role"]
                },
                TransportType,
                {
                    model:Transport,
                    attributes: ["id", "vehicle_identifier"]
                }
            ],
            attributes: [
                "id",
                "user_id",
                "type_id",
                "vehicle_count",
                "reason",
                "departure_time",
                "return_time",
                "status",
                "justification_path",
                "createdAt"
            ],
            order: [["createdAt", "DESC"]],
        });

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
};

// APPROVE booking
export const approveBooking = async (req, res) => {
    const { id } = req.params;

    try {
        const booking = await Booking.findByPk(id, {
            include: [
                { model: User, attributes: ["email", "name"] },
                { model: Transport, through: { attributes: [] } }
            ]
        });

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        if (booking.status !== "pending") {
            return res.status(400).json({ error: "Only pending bookings can be approved." });
        }

        // Update booking status
        booking.status = "approved";
        await booking.save();

        // Prepare vehicle list for email
        const vehiclesList = booking.Transports.map(v => `<li>${v.vehicle_identifier}</li>`).join("");

        // Prepare email content
        const htmlContent = `
            <h2>Booking Approved</h2>
            <p>Dear ${booking.User.name},</p>
            <p>Your booking has been approved. Here are your details:</p>
            <ul>
                <li><strong>Reason:</strong> ${booking.reason}</li>
                <li><strong>Departure:</strong> ${new Date(booking.departure_time).toLocaleString()}</li>
                <li><strong>Return:</strong> ${new Date(booking.return_time).toLocaleString()}</li>
                <li><strong>Assigned Vehicles:</strong>
                    <ul>${vehiclesList}</ul>
                </li>
            </ul>
            <p>Thank you for choosing UniTransport.</p>
        `;

        // Send email
        await sendBookingApprovalEmail(booking.User.email, "Your Booking Has Been Approved", htmlContent);

        res.json({ message: "Booking approved and email sent", booking });

    } catch (err) {
        console.error("Approval failed:", err);
        res.status(500).json({ error: "Approval failed", details: err.message });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        // Count users
        const userCountPromise = User.count();

        // Count bookings (total and by status)
        const bookingCountsPromise = Promise.all([
            Booking.count(), // total
            Booking.count({ where: { status: "pending" } }),
            Booking.count({ where: { status: "approved" } }),
            Booking.count({ where: { status: "cancelled" } }),
            Booking.count({ where: { status: "denied" } }),
        ]);

        // Count transport data
        const transportCountsPromise = Promise.all([
            Transport.count(),      // total vehicles
            TransportType.count(),  // total transport types
        ]);

        // Await all in parallel
        const [
            totalUsers,
            [totalBookings, pendingBookings, approvedBookings, cancelledBookings, deniedBookings],
            [totalVehicles, totalTypes],
        ] = await Promise.all([
            userCountPromise,
            bookingCountsPromise,
            transportCountsPromise,
        ]);

        // Response payload
        res.json({
            users: totalUsers,
            bookings: {
                total: totalBookings,
                pending: pendingBookings,
                approved: approvedBookings,
                cancelled: cancelledBookings,
                denied: deniedBookings,
            },
            transports: {
                totalVehicles,
                totalTypes,
            },
        });
    } catch (err) {
        res.status(500).json({
            error: "Failed to fetch dashboard stats",
            details: err.message,
        });
    }
};
export const denyBooking = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) return res.status(404).json({ error: "Booking not found" });

        const assignedTransports = await BookingTransport.findAll({ where: { booking_id: booking.id } });

        for (const assignment of assignedTransports) {
            const transport = await Transport.findByPk(assignment.transport_id);
            if (transport) {
                transport.status = "available"; // Mark it available again
                await transport.save();
            }
        }

        booking.status = "denied";
        await booking.save();

        res.json({ message: "Booking denied and vehicles freed.", booking });
    } catch (err) {
        console.error("Deny failed:", err);
        res.status(500).json({ error: "Deny failed", details: err.message });
    }
};
export const getAllChats = async (req, res) => {
    try {
        const chats = await Chat.find({});
        res.json(chats);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch chats" });
    }
};