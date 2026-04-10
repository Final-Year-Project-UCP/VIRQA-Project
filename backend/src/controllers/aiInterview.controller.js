import { AIInterview } from "../models/aiInterview.model.js";
import mongoose from "mongoose";

/**
 * Initializes a new AI Interview Session
 * POST /api/v1/ai-interview/start
 */
export const startAIInterview = async (req, res) => {
    try {
        const { candidateId, role, experience, difficulty, interviewSessionId } = req.body;

        if (!candidateId || !role || !experience) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        // Fetch Interview Session to enforce expiration
        if (interviewSessionId) {
            const session = await mongoose.model("InterviewSession").findById(interviewSessionId);
            if (session && session.expiresAt) {
                if (new Date() > new Date(session.expiresAt)) {
                    return res.status(403).json({
                        success: false,
                        code: "INTERVIEW_EXPIRED",
                        message: "The deadline for this interview has passed. You can no longer start it."
                    });
                }
            }
        }

        // Check for existing session for this specific interview
        const existingSession = await AIInterview.findOne({
            candidateId,
            interviewSessionId: interviewSessionId || undefined,
            status: { $in: ["ongoing", "completed"] }
        });

        if (existingSession) {
            if (existingSession.status === "completed") {
                return res.status(403).json({
                    success: false,
                    code: "INTERVIEW_ALREADY_COMPLETED",
                    message: "Interview already completed. You cannot rejoin your previous attempt."
                });
            }
            // Return existing ongoing session to allow persistence
            return res.status(200).json({
                success: true,
                message: "Resuming existing interview session.",
                data: existingSession
            });
        }

        const newSession = new AIInterview({
            candidateId,
            interviewSessionId: interviewSessionId || undefined,
            role,
            experience,
            currentDifficulty: difficulty || "medium",
            status: "ongoing"
        });

        await newSession.save();

        res.status(201).json({
            success: true,
            message: "AI Interview session created successfully.",
            data: newSession
        });
    } catch (error) {
        console.error("Start AI interview error:", error);
        res.status(500).json({ success: false, message: "Server error creating AI interview." });
    }
};

/**
 * Get AI Interview Session by ID
 * GET /api/v1/ai-interview/:id
 */
export const getAIInterview = async (req, res) => {
    try {
        const { id } = req.params;

        const session = await AIInterview.findById(id)
            .populate("candidateId", "fullName email")
            .populate({
                path: "interviewSessionId",
                select: "duration showResultToCandidate"
            });
        if (!session) {
            return res.status(404).json({ success: false, message: "AI Session not found." });
        }

        res.status(200).json({
            success: true,
            data: session
        });
    } catch (error) {
        console.error("Get AI interview error:", error);
        res.status(500).json({ success: false, message: "Server error fetching AI interview." });
    }
};

/**
 * End AI Interview Session
 * POST /api/v1/ai-interview/end
 */
export const endAIInterview = async (req, res) => {
    try {
        const { id } = req.body;

        const session = await AIInterview.findById(id);
        if (!session) {
            return res.status(404).json({ success: false, message: "AI Session not found." });
        }

        session.status = "completed";
        await session.save();

        res.status(200).json({
            success: true,
            message: "AI Interview ended successfully.",
            data: session
        });
    } catch (error) {
        console.error("End AI interview error:", error);
        res.status(500).json({ success: false, message: "Server error ending AI interview." });
    }
};
