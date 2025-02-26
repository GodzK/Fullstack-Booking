import jwt from "jsonwebtoken";

// Middleware to verify token
export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    console.log(token);

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log(req.user);

        next();
    } catch (error) {   +
        res.status(401).json({ message: "Invalid Token", error: error.message });
    }
};

export const checkRole = (roles) => {
    return (req, res, next) => {
        console.log("Cookies:", req.cookies); 
         console.log("User Role:", req.user.role);
         if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

       

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: You don't have permission" });
        }

        next();
    };
};
