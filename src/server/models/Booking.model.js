import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.mysql.js";
import User from "./User.model.js";
import TransportType from "./TransportType.model.js";

const Booking = sequelize.define("Booking", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    vehicle_count: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reason: {
        type: DataTypes.TEXT
    },
    departure_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    return_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("pending", "approved", "denied", "completed", "cancelled"),
        defaultValue: "pending"
    },
    justification_path: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
    tableName: "bookings"
});

// Relations
Booking.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Booking, { foreignKey: "user_id" });

Booking.belongsTo(TransportType, { foreignKey: "type_id" });
TransportType.hasMany(Booking, { foreignKey: "type_id" });

export default Booking;
