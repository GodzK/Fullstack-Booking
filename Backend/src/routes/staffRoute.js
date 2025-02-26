import express from "express";
import { fetchStaff } from "../controllers/staffController.js";
import { verifyToken, checkRole } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/", verifyToken, checkRole("staff"), fetchStaff);

export default router;
