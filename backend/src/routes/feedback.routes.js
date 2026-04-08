import { Router } from "express";
import { verifyJwt } from "../middlewares/authMiddleware.js";
import { submitFeedback, getCandidateFeedback, getEmployeeFeedback, getAllFeedback } from "../controllers/feedback.controller.js";

const router = Router();
router.use(verifyJwt);

router.post("/submit", submitFeedback);
router.get("/candidate", getCandidateFeedback);
router.get("/employee", getEmployeeFeedback);
router.get("/admin", getAllFeedback);

export default router;
