import { Router } from "express";
import { verifyJwt } from "../middlewares/authMiddleware.js";
import handleProfile from "../controllers/employee.controller.js";
const router=Router();
router.post("/profile",verifyJwt,handleProfile);
export default router