import { Router } from "express";
import { registerHandler, LoginHandler, logoutHandler, changePasswordHandler, forgotPasswordHandler, verifyOTPHandler, resetPasswordHandler } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/register', registerHandler);
router.post('/login', LoginHandler);
router.post("/logout",verifyJwt,logoutHandler)
router.patch("/change-password", verifyJwt, changePasswordHandler);

// Forgot Password routes (No JWT required since they are logged out)
router.post('/forgot-password', forgotPasswordHandler);
router.post('/verify-otp', verifyOTPHandler);
router.post('/reset-password', resetPasswordHandler);


export default router;