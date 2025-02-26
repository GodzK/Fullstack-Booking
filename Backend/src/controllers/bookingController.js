import { createBooking, checkRoomAvailability, cancelBooking } from "../models/BookingModel.js";
import moment from "moment";
import db from "../config/database.js"
export const bookRoom = async (req, res) => {
    try {
        let { room_id, start_time, end_time, status, description } = req.body;
        const user_id = req.user.id;

        if (!moment(start_time).isValid() || !moment(end_time).isValid()) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        if (moment(start_time).isAfter(moment(end_time))) {
            return res.status(400).json({ message: "Start time must be before end time" });
        }

        // Check if the room exists
        const [room] = await db.execute("SELECT * FROM Rooms WHERE room_id = ?", [room_id]);
        if (room.length === 0) {
            return res.status(400).json({ message: "Invalid room_id. Room does not exist." });
        }

        // Check room availability
        const isAvailable = await checkRoomAvailability(room_id, start_time, end_time);
        if (!isAvailable) {
            return res.status(400).json({ message: "Room is already booked for this time slot" });
        }

        // Create the booking
        const booking = await createBooking(user_id, room_id, start_time, end_time, status, description, user_id);
        res.status(201).json({ message: "Booking Successful", booking });
    } catch (err) {
        res.status(500).json({ message: "Booking Failed", error: err.message });
    }
};

export const fetchBookings = async (req, res) => {
    try {
        const { building, area, room } = req.query; 

        let query = `
            SELECT Booking.*, Users.email, Rooms.building, Rooms.area, Rooms.room_name 
            FROM Booking 
            LEFT JOIN Users ON Users.user_id = Booking.user_id
            LEFT JOIN Rooms ON Rooms.room_id = Booking.room_id
        `;

        const conditions = [];
        const params = [];

        if (building) {
            conditions.push("Rooms.building = ?");
            params.push(building);
        }
        if (area) {
            conditions.push("Rooms.area = ?");
            params.push(area);
        }
        if (room) {
            conditions.push("Rooms.room_name = ?"); 
            params.push(room);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        const [bookings] = await db.execute(query, params);
        res.status(200).json({ bookings });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
    }
};


export const cancelUserBooking = async (req, res) => {
    try {
        const { booking_id } = req.params; 

        const [booking] = await db.execute("SELECT * FROM Booking WHERE booking_id = ?", [booking_id]);
        if (booking.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking[0].user_id !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized: You can only cancel your own bookings" });
        }

        const success = await cancelBooking(booking_id);
        if (!success) {
            return res.status(400).json({ message: "Failed to cancel booking" });
        }

        res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (err) {
        res.status(500).json({ message: "Cancellation failed", error: err.message });
    }
};

export const updateStatus = async (req, res) => {
    const { bookingId } = req.params;
    const { status } = req.body;
    
    if (!status) {
        return res.status(400).json({ message: "Status is required" });
    }
    
    try {
        const query = "UPDATE Booking SET status = ?, last_updated = NOW() WHERE booking_id = ?";
        const [result] = await db.execute(query, [status, bookingId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }
        
        res.json({ message: "Booking status updated successfully" });
    } catch (error) {
        console.error("Error updating booking status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


