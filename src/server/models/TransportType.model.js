import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.mysql.js";

const TransportType = sequelize.define("TransportType", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    type: { type: DataTypes.STRING,
        allowNull: false
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true,
    tableName: "transport_types"
});

export default TransportType;
