import db from "../config/database.js";

export const getUserByEmail = async (email) => {
    const [rows] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
    return rows.length > 0 ? rows[0] : null;
};

export const createUser = async ({ firstname, lastname, email, password, role }) => {
    const [result] = await db.query(
        "INSERT INTO Users (firstname, lastname, email, password, role) VALUES (?, ?, ?, ?, ?)", 
        [firstname, lastname, email, password, role]
    );
    return result;
};
export const getUserProfile = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    res.json(req.user);
};

export const getIduser= (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    res.json({ userId: req.user.id });
};
export const getRoleuser= (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    res.json({ userId: req.user.role });
    console.log(req.user.role)
};

