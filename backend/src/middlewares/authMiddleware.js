import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
const restrictToRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden" })
        }
        next()
    }
}


const verifyJwt = async (req, res, next) => {
    try {
            const token = req.cookies.token;
            if (!token) {
                throw new ApiError(401,"unauthorized")
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            if (!user) {
               throw new ApiError(401,"unauthorized")
    
            }
            req.user = user;
            next()
    } catch (error) {
        throw new ApiError(401,error?.message||"unauthorized");
    }
}

export {
    restrictToRole,
    verifyJwt 
}