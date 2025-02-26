import mysql from "mysql2/promise"; 

import dotenv from "dotenv";
dotenv.config();

// create pool ทำให้ไม่ต้องใช้connect
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
});

export default connection;
