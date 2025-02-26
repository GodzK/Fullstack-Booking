import pool from "../config/database.js";

export const getUserByEmail = async (email) => {
    const [rows] = await pool.query("SELECT * FROM user WHERE email = ?", [email]);
    return rows[0]; 
};

export const createUser = async ({ firstname, lastname, email, password, role }) => {
    try {
        const [result] = await db.query(
            "INSERT INTO user (firstname, lastname, email, password, role) VALUES (?, ?, ?, ?, ?)",
            [firstname, lastname, email, password, role] 
        );
        return result;
    } catch (error) {
        console.error("Error in createUser:", error);
        throw error; 
    }
};