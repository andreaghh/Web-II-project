import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.mysql.js";
import TransportType from "./TransportType.model.js";

const Transport = sequelize.define("Transport", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    vehicle_identifier: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("available", "booked"),
        defaultValue: "available"
    }
}, {
    timestamps: true,
    tableName: "transports"
});

Transport.belongsTo(TransportType, { foreignKey: "type_id" });
TransportType.hasMany(Transport, { foreignKey: "type_id" });

export default Transport;
