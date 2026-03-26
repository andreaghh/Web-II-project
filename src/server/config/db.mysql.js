import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
    process.env.MYSQL_DB,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        dialect: "mysql",
        logging: false,
        timezone: "-06:00",
    }
);

// Test connection
sequelize.authenticate()
    .then(() => console.log("MySQL connection established."))
    .catch((err) => console.error("Unable to connect to MySQL:", err));
