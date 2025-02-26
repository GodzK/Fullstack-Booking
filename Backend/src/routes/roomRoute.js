import express from "express";
import { fetchRooms, fetchRoomById, addRoom ,fetchAreasByBuilding,fetchBuildings,fetchRoomsByArea} from "../controllers/roomController.js";
import { verifyToken, checkRole } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/", verifyToken, fetchRooms);
router.get("/buildings", verifyToken, fetchBuildings);
router.get("/:id", verifyToken, fetchRoomById);
router.post("/", verifyToken, checkRole("admin"), addRoom);
router.get("/area/:area", verifyToken, async (req, res) => {
    const { area } = req.params;
    const rooms = await fetchRoomsByArea(area);
    res.json(rooms);
});

router.get("/areas/:building", verifyToken, fetchAreasByBuilding);
router.get("/rooms/:area", verifyToken, fetchRoomsByArea);
export default router;
