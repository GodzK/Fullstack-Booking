import { getUserByEmail, createUser } from "../models/userModel.js";
import jwt from "jsonwebtoken"
export const register = async (req, res) => {
    try {
        const { firstname, lastname, email, password, role } = req.body;

        const newUser = await createUser({ firstname, lastname, email, password, role }); // No hashing

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser.insertId,
                firstname,
                lastname,
                email,
                role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Signup failed", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await getUserByEmail(email);

        if (!user) return res.status(401).json({ message: "No user found" });

        if (user.password !== password) { 
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({
            id: user.user_id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role
        },process.env.JWT_SECRET)
        res.cookie("token",token,{
            maxAge : 3*60*60*1000
        })
        console.log(token);
        

        res.json({ message: "Login successful", data: user });
    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }
};

export const logout = (req, res) => {
    res.clearCookie(
        "token"
    );
    return res.status(200).json(
        { message: "Logout successful" }
    )
};
