import { getAllStaff } from "../models/staffModel.js";

export const fetchStaff = async (req, res) => {
    try {
        const staff = await getAllStaff();
        res.status(200).json({ staff });
        console.log(staff)
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch staff", error: err.message });
    }
};
