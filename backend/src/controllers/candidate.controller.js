import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import InterviewSession from "../models/interviewSession.model.js";
import { AIInterview } from "../models/aiInterview.model.js";

// @desc    Get all interview sessions where the logged-in candidate is invited
// @route   GET /api/v1/candidate/my-interviews
const getMyInterviews = asyncHandler(async (req, res) => {
    // Find sessions where the candidates array contains an object with this candidate's ID
    const interviews = await InterviewSession.find({
        "candidates.candidateId": req.user._id
    })
        .populate("createdBy", "fullName organization organizationLogo profilePhoto")
        .sort("-createdAt");

    return res.status(200).json(
        new ApiResponse(200, interviews, "Upcoming interviews fetched successfully")
    );
});

// @desc    Mark interview as completed for the logged-in candidate
// @route   PATCH /api/v1/candidate/interview/:id/complete
const completeInterviewSession = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const session = await InterviewSession.findOne({
        _id: id,
        "candidates.candidateId": req.user._id
    });

    if (!session) {
        throw new ApiError(404, "Interview session not found or you are not a participant");
    }

    // Find the candidate in the array and update status
    const candidateIndex = session.candidates.findIndex(
        c => c.candidateId.toString() === req.user._id.toString()
    );

    if (candidateIndex !== -1) {
        session.candidates[candidateIndex].status = "Completed";
        await session.save();
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Interview marked as completed")
    );
});

// @desc    Get Candidate completed AI results
// @route   GET /api/v1/candidate/my-results
const getMyResults = asyncHandler(async (req, res) => {
    // Find all completed AI Interviews for this candidate
    const results = await AIInterview.find({
        candidateId: req.user._id,
        status: "completed"
    })
        // populate the associated InterviewSession to get company/createdBy details if needed
        .populate({
            path: "interviewSessionId",
            select: "jobTitle scheduledDate startTime duration showResultToCandidate createdBy",
            populate: { path: "createdBy", select: "fullName organization" }
        })
        .sort("-createdAt");

    return res.status(200).json(
        new ApiResponse(200, results, "Candidate results fetched successfully")
    );
});

export {
    getMyInterviews,
    completeInterviewSession,
    getMyResults
};
