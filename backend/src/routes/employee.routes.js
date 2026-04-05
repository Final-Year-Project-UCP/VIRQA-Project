import { Router } from "express";
import { verifyJwt } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {handleProfile,activateAccount} from "../controllers/employee.controller.js";
const employeeRouter=Router();
employeeRouter.post("/profile",
      upload.fields([
        { name: "profilePhoto", maxCount: 1 }
         ]),
         verifyJwt,handleProfile);
employeeRouter.post("/activate-account",
    verifyJwt,
    activateAccount
)
export default employeeRouter