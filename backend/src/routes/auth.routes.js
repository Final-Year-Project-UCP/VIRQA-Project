import { Router } from "express";
import { registerHandler, LoginHandler,logoutHandler } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/register', registerHandler);
router.post('/login', LoginHandler);
router.post("/logout",verifyJwt,logoutHandler)


export default router;