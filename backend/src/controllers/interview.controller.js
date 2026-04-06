import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import InterviewSession from "../models/interviewSession.model.js";
import { Candidate, User } from "../models/user.model.js";
import { sendInterviewInvite, sendInterviewReschedule } from "../utils/Email.js";
import crypto from "crypto";
import openai from "../utils/openai.js";

// Helper function to handle candidate creation/finding and inviting
const processCandidate = async (email, { jobTitle, date, time, duration, createdBy }) => {
    let existingUser = await User.findOne({ email });
    let tempPassword = "";

    if (!existingUser) {
        tempPassword = crypto.randomBytes(4).toString("hex");
        const candidate = await Candidate.create({
            email,
            fullName: email.split("@")[0],
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
            email: existingUser.email,
            inviteSent: emailSent
        };
    } catch (error) {
        console.error(`Failed to send invite to ${email}:`, error);
        return {
            candidateId: existingUser._id,
            email: existingUser.email,
            inviteSent: false
        };
    }
};

// @desc    Create a new interview session and invite candidates
// @route   POST /api/v1/employee/interview/create
const createInterview = asyncHandler(async (req, res) => {
    const {
        jobTitle,
        jobDescription,
        topic,
        scheduledDate,
        startTime,
        duration,
        candidateEmails
    } = req.body;

    if (!jobTitle || !jobDescription || !scheduledDate || !startTime || !candidateEmails?.length) {
        console.error("Missing fields for interview creation:", { jobTitle, jobDescription, scheduledDate, startTime, candidateEmailsLength: candidateEmails?.length });
        throw new ApiError(400, "All required fields must be provided");
    }

    const sessionCandidates = [];
    for (const email of candidateEmails) {
        const result = await processCandidate(email, {
            jobTitle,
            date: scheduledDate,
            time: startTime,
            duration,
            createdBy: req.user._id
        });
        sessionCandidates.push(result);
    }

    const interviewSession = await InterviewSession.create({
        jobTitle,
        jobDescription,
        topic: topic || "General Interview",
        scheduledDate,
        startTime,
        duration,
        candidates: sessionCandidates,
        createdBy: req.user._id
    });

    return res.status(201).json(new ApiResponse(201, interviewSession, "Interview session created"));
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

    // Check if it exists at all for debugging
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
    const { jobTitle, jobDescription, topic, scheduledDate, startTime, duration } = req.body;
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

    await session.save();

    // If schedule changed, notify all candidates
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
    const { email } = req.body;
    const session = await InterviewSession.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!session) throw new ApiError(404, "Interview session not found");
    if (session.candidates.some(c => c.email === email)) {
        throw new ApiError(400, "Candidate already in this session");
    }

    const result = await processCandidate(email, {
        jobTitle: session.jobTitle,
        date: session.scheduledDate,
        time: session.startTime,
        duration: session.duration,
        createdBy: req.user._id
    });

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

// @desc    Generate dynamic AI prompt for Interview Creation
// @route   POST /api/v1/employee/interview/generate-prompt
const generateAIPrompt = asyncHandler(async (req, res) => {
    const { jobTitle, jobDescription, candidateCount } = req.body;

    if (!jobTitle || !jobDescription) {
        throw new ApiError(400, "Job title and description are required to generate prompt");
    }

    const systemPrompt = `You are an expert HR assistant. Based on the following job title and description, generate a detailed system prompt for an AI Interviewer Agent.
    
Job Title: ${jobTitle}
Description: ${jobDescription}

The output should purely be the 'System Prompt' string that configures the AI interviewer. 
The prompt should instruct the AI interviewer to:
1. Act exclusively as the interviewer for the ${jobTitle} role.
2. Structure the interview flow covering introduction, technical skills based strictly on the description, and behavioral assessment.
3. Be professional, direct, and assess actual competence.
4. Conclude the interview effectively.
(There will be ~${candidateCount || 0} candidates taking this interview.)`;

    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: systemPrompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const generatedPrompt = response.choices[0].message.content.trim();

    return res.status(200).json(new ApiResponse(200, { generatedPrompt }, "AI Prompt generated successfully"));
});

export {
    createInterview,
    getMyInterviews,
    getInterviewById,
    updateInterview,
    addCandidateToSession,
    deleteInterview,
    generateAIPrompt
};
