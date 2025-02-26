import db from "../config/database.js";

export const getAllStaff = async () => {
    const [rows] = await db.query(`SELECT * FROM Staff`);
    return rows;
};
