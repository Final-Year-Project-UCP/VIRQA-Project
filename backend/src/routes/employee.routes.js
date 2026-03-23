import { Router } from "express";
import { verifyJwt } from "../middlewares/authMiddleware.js";
import {handleProfile,activateAccount} from "../controllers/employee.controller.js";
const employeeRouter=Router();
employeeRouter.post("/profile",verifyJwt,handleProfile);
employeeRouter.post("/activate-account",
    verifyJwt,
    activateAccount
)
export default employeeRouter