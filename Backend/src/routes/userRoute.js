import express from "express";
import { getUserProfile , getIduser , getRoleuser} from "../models/userModel.js";

const router = express.Router();

router.get("/Profile" , getUserProfile)
router.get("/userId", getIduser);
router.get("/role", getRoleuser);
export default router;