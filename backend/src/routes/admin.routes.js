import { Router } from "express";
import { getProfile,handleProfile } from "../controllers/admin.controller.js";
import { verifyJwt } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const adminRouter=Router()
adminRouter.get("/profile",
    verifyJwt,
    getProfile
)
adminRouter.post("/profile",
    verifyJwt,
     upload.fields([
    { name: "profilePhoto", maxCount: 1 }
     ]),
    handleProfile
)
export default adminRouter