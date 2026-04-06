import { Router } from "express";
import { verifyJwt } from "../middlewares/authMiddleware.js";
import { getMyInterviews, completeInterviewSession, getMyResults } from "../controllers/candidate.controller.js";

const candidateRouter = Router();

// GET all interviews for the logged-in candidate
candidateRouter.get("/my-interviews", verifyJwt, getMyInterviews);

// PATCH mark interview as completed
candidateRouter.patch("/interview/:id/complete", verifyJwt, completeInterviewSession);

// GET candidate results
candidateRouter.get("/my-results", verifyJwt, getMyResults);

export default candidateRouter;
