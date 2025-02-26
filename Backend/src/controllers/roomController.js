import { getAllRooms, getRoomById, createRoom , getAllBuildings, getAreasByBuilding, getRoomsByArea } from "../models/roomModel.js";

export const fetchRooms = async (req, res) => {
    try {
        const rooms = await getAllRooms();
        res.status(200).json({ rooms });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch rooms", error: err.message });
    }
};

export const fetchRoomById = async (req, res) => {
    try {
        const room = await getRoomById(req.params.id);
        if (!room) return res.status(404).json({ message: "Room not found" });
        res.status(200).json({ room });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch room", error: err.message });
    }
};


export const addRoom = async (req, res) => {
    try {
        const { room_name, capacity, area } = req.body;
        const newRoom = await createRoom(room_name, capacity, area);
        res.status(201).json({ message: "Room added successfully", room: newRoom });
    } catch (err) {
        res.status(500).json({ message: "Failed to add room", error: err.message });
    }
};



// ดึงข้อมูล Building ทั้งหมด
export const fetchBuildings = async (req, res) => {
    try {
        const buildings = await getAllBuildings();
        res.status(200).json({ buildings });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch buildings", error: err.message });
    }
};

// ดึงข้อมูล Area ตาม Building ที่เลือก
export const fetchAreasByBuilding = async (req, res) => {
    try {
        const { building } = req.params;
        const areas = await getAreasByBuilding(building);
        res.status(200).json({ areas });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch areas", error: err.message });
    }
};

// ดึงข้อมูลห้องตาม Area ที่เลือก
export const fetchRoomsByArea = async (req, res) => {
    try {
        const { area } = req.params;
        const rooms = await getRoomsByArea(area);
        res.status(200).json({ rooms });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch rooms", error: err.message });
    }
};
