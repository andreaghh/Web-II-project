import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.mysql.js";
import Booking from "./Booking.model.js";
import Transport from "./Transport.model.js";

const BookingTransport = sequelize.define("BookingTransport", {
    booking_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Booking,
            key: "id",
        }
    },
    transport_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Transport,
            key: "id",
        }
    }
}, {
    timestamps: false,
    tableName: "booking_transports",
});

Booking.belongsToMany(Transport, { through: BookingTransport, foreignKey: "booking_id" });
Transport.belongsToMany(Booking, { through: BookingTransport, foreignKey: "transport_id" });

export default BookingTransport;
