import express from "express";
import { bookRoom, cancelUserBooking, fetchBookings, updateStatus } from "../controllers/bookingController.js";
import { checkRole, verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, fetchBookings);
router.post("/", checkRole("student", "professor"), bookRoom);
router.delete("/:booking_id", cancelUserBooking);
router.put("/:bookingId", updateStatus)

export default router;