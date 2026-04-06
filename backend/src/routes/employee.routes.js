import { Router } from "express";
import { verifyJwt } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { handleProfile, activateAccount, getProfile, getDashboardStats } from "../controllers/employee.controller.js";
import {
    createInterview,
    getMyInterviews,
    getInterviewById,
    updateInterview,
    addCandidateToSession,
    deleteInterview,
    generateAIPrompt
} from "../controllers/interview.controller.js";

const employeeRouter = Router();

// GET dashboard stats
employeeRouter.get("/dashboard-stats", verifyJwt, getDashboardStats);

// GET own profile
employeeRouter.get("/profile", verifyJwt, getProfile);

// POST update profile (with optional photo upload)
employeeRouter.post("/profile",
    upload.fields([{ name: "profilePhoto", maxCount: 1 }]),
    verifyJwt,
    handleProfile
);

employeeRouter.post("/activate-account", verifyJwt, activateAccount);

// Interview Routes
employeeRouter.post("/interview/generate-prompt", verifyJwt, generateAIPrompt);
employeeRouter.post("/interview/create", verifyJwt, createInterview);
employeeRouter.get("/interviews", verifyJwt, getMyInterviews);
employeeRouter.get("/interview/:id", verifyJwt, getInterviewById);
employeeRouter.patch("/interview/:id", verifyJwt, updateInterview);
employeeRouter.post("/interview/:id/candidate", verifyJwt, addCandidateToSession);
employeeRouter.delete("/interview/:id", verifyJwt, deleteInterview);

export default employeeRouter;