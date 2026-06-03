import { Router } from "express";
import { 
    registerHandler, 
    LoginHandler, 
    logoutHandler, 
    changePasswordHandler, 
    forgotPasswordHandler, 
    verifyOTPHandler, 
    resetPasswordHandler,
    getProfile,
    updateProfile
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post('/register', registerHandler);
router.post('/login', LoginHandler);
router.post("/logout",verifyJwt,logoutHandler)
router.patch("/change-password", verifyJwt, changePasswordHandler);

// Forgot Password routes (No JWT required since they are logged out)
router.post('/forgot-password', forgotPasswordHandler);
router.post('/verify-otp', verifyOTPHandler);
router.post('/reset-password', resetPasswordHandler);

// Profile Management
router.get('/profile', verifyJwt, getProfile);
router.patch('/profile', verifyJwt, upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "resume", maxCount: 1 }
]), updateProfile);


export default router;