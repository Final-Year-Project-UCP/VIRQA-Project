import { Router } from "express";
import { startAIInterview, getAIInterview, endAIInterview } from "../controllers/aiInterview.controller.js";

const router = Router();

router.post("/start", startAIInterview);
router.get("/:id", getAIInterview);
router.post("/end", endAIInterview);

export default router;
