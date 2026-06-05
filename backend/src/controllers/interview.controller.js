import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import InterviewSession from "../models/interviewSession.model.js";
import { createNotification } from "../utils/notificationUtils.js";
import { Candidate, User } from "../models/user.model.js";
import { sendInterviewInvite, sendInterviewReschedule } from "../utils/Email.js";
import crypto from "crypto";
import { AIInterview } from "../models/aiInterview.model.js";

// Helper function to handle candidate creation/finding and inviting
const processCandidate = async (email, { jobTitle, date, time, duration, createdBy }, candidateName = "") => {
    let existingUser = await User.findOne({ email });
    let tempPassword = "";

    if (!existingUser) {
        tempPassword = crypto.randomBytes(4).toString("hex");
        const candidate = await Candidate.create({
            email,
            fullName: candidateName || email.split("@")[0],
            password: tempPassword,
            needsPasswordChange: true,
            status: "Pending",
            createdBy
        });
        existingUser = candidate;
    } else {
        tempPassword = "Use your existing password";
    }

    try {
        const emailSent = await sendInterviewInvite(email, {
            jobTitle,
            date: new Date(date).toLocaleDateString(),
            time,
            duration,
            password: tempPassword
        });

        return {
            candidateId: existingUser._id,
            name: candidateName || existingUser.fullName || email.split("@")[0],
            email: existingUser.email,
            inviteSent: emailSent
        };
    } catch (error) {
        console.error(`Failed to send invite to ${email}:`, error);
        return {
            candidateId: existingUser._id,
            name: candidateName || existingUser.fullName || email.split("@")[0],
            email: existingUser.email,
            inviteSent: false
        };
    }
};

// @desc    Create a new live AI interview session and invite candidates
// @route   POST /api/v1/employee/interview/create
const createInterview = asyncHandler(async (req, res) => {
    const {
        candidates: candidatesInput = [],   // [{name, email}]
        domain,
        skills,
        experienceLevel,
        difficulty,
        scheduledDate,
        startTime,
        duration,
        showResultToCandidate,
        expiresAt,
        jobTitle,
        jobDescription,
        candidateEmails,
    } = req.body;

    // Support both new (candidates array) and legacy (candidateEmails array)
    let candidateList = candidatesInput;
    if (candidateList.length === 0 && candidateEmails?.length > 0) {
        candidateList = candidateEmails.map(email => ({ email, name: "" }));
    }

    if (!scheduledDate || !startTime || candidateList.length === 0) {
        throw new ApiError(400, "Scheduled date, start time, and at least one candidate are required");
    }

    const interviewTitle = domain || jobTitle || "General Interview";

    // Set default expiration if not provided (default: 24 hours after start time)
    let finalExpiresAt = expiresAt;
    if (!finalExpiresAt) {
        const startDateTime = new Date(`${scheduledDate}T${startTime}`);
        finalExpiresAt = new Date(startDateTime.getTime() + (24 * 60 * 60 * 1000));
    }

    const sessionCandidates = [];
    for (const candidate of candidateList) {
        const result = await processCandidate(
            candidate.email,
            {
                jobTitle: interviewTitle,
                date: scheduledDate,
                time: startTime,
                duration: parseInt(duration) || 60,
                createdBy: req.user._id
            },
            candidate.name || ""
        );
        sessionCandidates.push(result);
    }

    const interviewSession = await InterviewSession.create({
        // ... (existing field initialization)
        jobTitle: interviewTitle,
        jobDescription: jobDescription || `${experienceLevel || "General"} level ${domain || ""} interview focusing on: ${Array.isArray(skills) ? skills.join(", ") : "General skills"}`,
        topic: domain || "General Interview",
        domain: domain || "",
        skills: Array.isArray(skills) ? skills : [],
        experienceLevel: experienceLevel || "Junior",
        difficulty: difficulty || "Medium",
        scheduledDate,
        startTime,
        duration: parseInt(duration) || 60,
        expiresAt: finalExpiresAt,
        showResultToCandidate: Boolean(showResultToCandidate),
        candidates: sessionCandidates,
        createdBy: req.user._id
    });

    // Notify each candidate
    for (const candidate of interviewSession.candidates) {
        await createNotification(req.app, {
            recipientId: candidate.candidateId,
            senderId: req.user._id,
            title: "New Interview Invitation",
            message: `You've been invited to an interview for ${interviewTitle} on ${scheduledDate} at ${startTime}.`,
            type: "interview_invite",
            data: { sessionId: interviewSession._id }
        });
    }

    return res.status(201).json(new ApiResponse(201, interviewSession, "Interview session created successfully"));
});

// @desc    Get all interview sessions created by the logged-in employee
// @route   GET /api/v1/employee/interviews
const getMyInterviews = asyncHandler(async (req, res) => {
    const interviews = await InterviewSession.find({ createdBy: req.user._id })
        .populate("candidates.candidateId", "fullName email profilePhoto")
        .sort("-createdAt");

    return res.status(200).json(new ApiResponse(200, interviews, "Interviews fetched"));
});

// @desc    Get single interview session details
// @route   GET /api/v1/employee/interview/:id
const getInterviewById = asyncHandler(async (req, res) => {
    console.log("Fetching interview by ID:", { id: req.params.id, userId: req.user._id });

    const docExists = await InterviewSession.findById(req.params.id);
    if (!docExists) console.error("ID does not exist in DB at all:", req.params.id);
    else if (docExists.createdBy.toString() !== req.user._id.toString()) {
        console.error("ID exists but owner mismatch:", { docOwner: docExists.createdBy, reqUser: req.user._id });
    }

    const session = await InterviewSession.findOne({
        _id: req.params.id,
        createdBy: req.user._id
    }).populate("candidates.candidateId", "fullName email profilePhoto phoneNumber biography");

    if (!session) {
        throw new ApiError(404, "Interview session not found");
    }

    return res.status(200).json(new ApiResponse(200, session, "Interview fetched"));
});

// @desc    Update interview session
// @route   PATCH /api/v1/employee/interview/:id
const updateInterview = asyncHandler(async (req, res) => {
    const { jobTitle, jobDescription, topic, scheduledDate, startTime, duration, showResultToCandidate, expiresAt } = req.body;
    const session = await InterviewSession.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!session) throw new ApiError(404, "Interview session not found");

    const dateChanged = scheduledDate && scheduledDate !== session.scheduledDate.toISOString().split('T')[0];
    const timeChanged = startTime && startTime !== session.startTime;

    session.jobTitle = jobTitle || session.jobTitle;
    session.jobDescription = jobDescription || session.jobDescription;
    session.topic = topic || session.topic;
    session.scheduledDate = scheduledDate || session.scheduledDate;
    session.startTime = startTime || session.startTime;
    session.duration = duration || session.duration;

    if (showResultToCandidate !== undefined) {
        session.showResultToCandidate = showResultToCandidate;
    }
    if (expiresAt) {
        session.expiresAt = expiresAt;
    }

    await session.save();

    if (dateChanged || timeChanged) {
        for (const candidate of session.candidates) {
            try {
                await sendInterviewReschedule(candidate.email, {
                    jobTitle: session.jobTitle,
                    date: new Date(session.scheduledDate).toLocaleDateString(),
                    time: session.startTime,
                    duration: session.duration
                });
            } catch (err) {
                console.error(`Reschedule email failed for ${candidate.email}`);
            }
        }
    }

    return res.status(200).json(new ApiResponse(200, session, "Interview updated successfully"));
});

// @desc    Add a single candidate to an existing session
// @route   POST /api/v1/employee/interview/:id/candidate
const addCandidateToSession = asyncHandler(async (req, res) => {
    const { email, name } = req.body;
    const session = await InterviewSession.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!session) throw new ApiError(404, "Interview session not found");
    if (session.candidates.some(c => c.email === email)) {
        throw new ApiError(400, "Candidate already in this session");
    }

    const result = await processCandidate(
        email,
        {
            jobTitle: session.jobTitle,
            date: session.scheduledDate,
            time: session.startTime,
            duration: session.duration,
            createdBy: req.user._id
        },
        name || ""
    );

    session.candidates.push(result);
    await session.save();

    const updatedSession = await InterviewSession.findById(session._id).populate("candidates.candidateId", "fullName email profilePhoto");

    return res.status(200).json(new ApiResponse(200, updatedSession, "Candidate added to session"));
});

// @desc    Delete interview session
// @route   DELETE /api/v1/employee/interview/:id
const deleteInterview = asyncHandler(async (req, res) => {
    const session = await InterviewSession.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!session) throw new ApiError(404, "Interview session not found");

    return res.status(200).json(new ApiResponse(200, null, "Interview deleted successfully"));
});

// @desc    Get specific candidate's result for an interview session
// @route   GET /api/v1/employee/interview/:sessionId/candidate/:candidateId/result
const getCandidateResult = asyncHandler(async (req, res) => {
    const { sessionId, candidateId } = req.params;

    // Verify session belongs to this employee
    const session = await InterviewSession.findOne({ _id: sessionId, createdBy: req.user._id });
    if (!session) throw new ApiError(404, "Interview session not found or access denied");

    // Find the AI interview result
    const result = await AIInterview.findOne({
        interviewSessionId: sessionId,
        candidateId: candidateId,
        status: "completed"
    }).populate("candidateId", "fullName email profilePhoto");

    if (!result) throw new ApiError(404, "Evaluation result not found for this candidate");

    return res.status(200).json(new ApiResponse(200, result, "Candidate evaluation fetched successfully"));
});

// @desc    Get complete candidate history for employee dashboard
// @route   GET /api/v1/employee/candidate-history
const getCandidateHistory = asyncHandler(async (req, res) => {
    // 1. Fetch all interview sessions created by this employer
    const sessions = await InterviewSession.find({ createdBy: req.user._id })
        .populate("candidates.candidateId", "fullName email profilePhoto")
        .sort("-createdAt");

    if (!sessions || sessions.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No candidates found"));
    }

    // 2. Fetch all AI interviews related to these sessions to extract scores
    const sessionIds = sessions.map(s => s._id);
    const aiInterviews = await AIInterview.find({
        interviewSessionId: { $in: sessionIds },
        status: "completed"
    });

    // Create a lookup map for fast retrieval
    const scoreMap = {};
    aiInterviews.forEach(ai => {
        const avg = (ai.scores?.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) || 0) / (ai.scores?.length || 1);
        scoreMap[`${ai.interviewSessionId}_${ai.candidateId}`] = Math.round(avg);
    });

    const historyList = [];
    sessions.forEach(session => {
        session.candidates.forEach(candidate => {
            // Skip malformed candidates without valid IDs
            if (!candidate.candidateId) return;

            const key = `${session._id}_${candidate.candidateId._id}`;
            const score = scoreMap[key] || null;

            // Map to match frontend static structure
            historyList.push({
                id: `${session._id}_${candidate.candidateId._id}`,
                candidateId: candidate.candidateId._id,
                sessionId: session._id,
                name: candidate.candidateId.fullName || candidate.candidateId.email.split("@")[0],
                email: candidate.candidateId.email,
                interview: session.jobTitle || session.domain || "General Interview",
                date: new Date(session.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                time: session.startTime,
                status: candidate.status || "Pending",
                score: score,
                timestamp: session.scheduledDate // for strict date sorting if needed
            });
        });
    });

    return res.status(200).json(new ApiResponse(200, historyList, "Candidate history fetched successfully"));
});

export {
    createInterview,
    getMyInterviews,
    getInterviewById,
    updateInterview,
    addCandidateToSession,
    deleteInterview,
    getCandidateResult,
    getCandidateHistory
};
