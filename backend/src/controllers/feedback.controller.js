import { Feedback } from "../models/feedback.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const submitFeedback = asyncHandler(async (req, res) => {
    const { interviewSessionId, rating, category, message } = req.body;
    const candidateId = req.user._id;

    if (!rating || !message) {
        return res.status(400).json(new ApiResponse(400, null, "Rating and message are required"));
    }

    if (!interviewSessionId) {
        // Enforce 1 general feedback per day
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentFeedback = await Feedback.findOne({
            candidateId,
            interviewSessionId: null,
            createdAt: { $gte: yesterday }
        });
        if (recentFeedback) {
            return res.status(429).json(new ApiResponse(429, null, "You can only submit general platform feedback once per day."));
        }
    }

    const feedbackData = {
        candidateId,
        rating,
        category,
        message
    };

    if (interviewSessionId) {
        feedbackData.interviewSessionId = interviewSessionId;
    }

    const newFeedback = await Feedback.create(feedbackData);

    return res.status(201).json(new ApiResponse(201, newFeedback, "Feedback submitted successfully"));
});

export const getCandidateFeedback = asyncHandler(async (req, res) => {
    const candidateId = req.user._id;
    const feedbackList = await Feedback.find({ candidateId }).sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, feedbackList, "Feedback retrieved successfully"));
});

export const getEmployeeFeedback = asyncHandler(async (req, res) => {
    const employeeId = req.user._id;

    // Find all interview sessions created by this employee
    const mongoose = (await import("mongoose")).default;

    const feedbackList = await Feedback.aggregate([
        {
            $lookup: {
                from: "interviewsessions", // collection name for InterviewSession
                localField: "interviewSessionId",
                foreignField: "_id",
                as: "session"
            }
        },
        { $unwind: "$session" },
        {
            $match: {
                "session.createdBy": mongoose.Types.ObjectId.createFromHexString(employeeId.toString())
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "candidateId",
                foreignField: "_id",
                as: "candidate"
            }
        },
        { $unwind: "$candidate" },
        { $sort: { createdAt: -1 } },
        {
            $project: {
                _id: 1,
                id: "$_id", // For frontend compatibility
                candidateName: "$candidate.fullName",
                candidateEmail: "$candidate.email",
                interviewTitle: "$session.jobTitle",
                date: "$createdAt",
                rating: 1,
                feedback: "$message",
                category: 1
            }
        }
    ]);

    return res.status(200).json(new ApiResponse(200, feedbackList, "Employee feedback retrieved successfully"));
});

export const getAllFeedback = asyncHandler(async (req, res) => {
    const feedbackList = await Feedback.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "candidateId",
                foreignField: "_id",
                as: "candidate"
            }
        },
        { $unwind: "$candidate" },
        {
            $lookup: {
                from: "interviewsessions",
                localField: "interviewSessionId",
                foreignField: "_id",
                as: "session"
            }
        },
        {
            $unwind: {
                path: "$session",
                preserveNullAndEmptyArrays: true
            }
        },
        { $sort: { createdAt: -1 } },
        {
            $project: {
                _id: 1,
                id: "$_id",
                candidateName: "$candidate.fullName",
                candidateEmail: "$candidate.email",
                interviewTitle: { $ifNull: ["$session.jobTitle", "General Feedback"] },
                date: "$createdAt",
                rating: 1,
                feedback: "$message",
                category: 1
            }
        }
    ]);

    return res.status(200).json(new ApiResponse(200, feedbackList, "All feedback retrieved successfully"));
});
