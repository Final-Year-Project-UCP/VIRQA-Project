import { Router } from "express";
import { registerHandler, LoginHandler } from "../controllers/user.js";

const router = Router();

router.post('/register', registerHandler);
router.post('/login', LoginHandler);



export default router;