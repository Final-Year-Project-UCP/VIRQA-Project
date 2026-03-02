import jwt from "jsonwebtoken";
import User from "../models/user.js";

const restrictToRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden" })
        }
        next()
    }
}


const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        req.user = user;
        next()
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error })
    }
}

export {
    restrictToRole,
    protect
}