import db from "../config/database.js";

export const createBooking = async (user_id, room_id, start_time, end_time, status, description, created_by) => {
    const query = `
        INSERT INTO Booking (user_id, room_id, start_time, end_time, status, description, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    const values = [user_id, room_id, start_time, end_time, status, description, created_by];
    const [result] = await db.execute(query, values);
    return result;
};

export const getBookings = async () => {
    const [rows] = await db.query("SELECT Booking.*, Users.email FROM Booking LEFT JOIN Users ON Users.user_id = Booking.user_id");
    return rows;
};
export const checkRoomAvailability = async (room_id, start_time, end_time) => {
    const [rows] = await db.query(
        `SELECT * FROM Booking 
        WHERE room_id = ? 
        AND ((start_time < ? AND end_time > ?) 
        OR (start_time >= ? AND start_time < ?))`,
        [room_id, end_time, start_time, start_time, end_time]
    );
    //ห้องว่าง
    return rows.length === 0; 
};

export const cancelBooking = async (booking_id) => {
    const [result] = await db.query(
        "DELETE FROM Booking WHERE booking_id = ?",
        [booking_id]
    );
    // ต้องคืนtrue ถ้าsuccess
    return result.affectedRows > 0;
};