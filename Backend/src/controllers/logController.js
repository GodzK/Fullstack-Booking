// import { createLog, getLogs } from "../models/logModel.js";

// export const logAction = async (req, res) => {
//     try {
//         const { booking_id, start_time, end_time, action } = req.body;
//         const changed_by = req.user.id;
//         const log = await createLog(booking_id, start_time, end_time, action, changed_by);
//         res.status(201).json({ message: "Log recorded", log });
//     } catch (err) {
//         res.status(500).json({ message: "Logging Failed", error: err.message });
//     }
// };

// export const fetchLogs = async (req, res) => {
//     try {
//         const logs = await getLogs();
//         res.status(200).json({ logs });
//     } catch (err) {
//         res.status(500).json({ message: "Failed to fetch logs", error: err.message });
//     }
// };
