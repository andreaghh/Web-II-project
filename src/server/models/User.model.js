import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.mysql.js";

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false },
    name: {
        type: DataTypes.STRING,
        allowNull: false },
    password: {
        type: DataTypes.STRING,
        allowNull: false },
    role: {
        type: DataTypes.ENUM("student", "staff", "professor", "admin"),
        allowNull: false,
        defaultValue: "student"
    },
    reset_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    reset_token_expiry: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    timestamps: true,
    tableName: "users"
});

export default User;
