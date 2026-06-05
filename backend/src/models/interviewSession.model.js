import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema({
    // Legacy fields (kept for backward compatibility)
    jobTitle: {
        type: String,
        trim: true,
        default: ""
    },
    jobDescription: {
        type: String,
        default: ""
    },
    topic: {
        type: String,
        default: "General Interview"
    },

    // ── NEW: Structured Interview Config ──
    domain: {
        type: String,
        trim: true,
        default: ""
    },
    skills: {
        type: [String],
        default: []
    },
    experienceLevel: {
        type: String,
        enum: ["Fresh", "Junior", "Mid", "Senior"],
        default: "Junior"
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        default: "Medium"
    },
    // Legacy fields (pre–live interview); no longer set on new sessions
    generalQuestionCount: { type: Number },
    scenarioQuestionCount: { type: Number },
    answerTimeLimit: { type: Number },
    questionType: { type: String, default: "" },
    numberOfQuestions: { type: Number },
    generatedQuestions: { type: [String], default: [] },
    selectedQuestions: { type: [String], default: [] },

    // ── Schedule ──
    scheduledDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String, // "HH:mm" format
        required: true
    },
    duration: {
        type: Number, // in minutes
        default: 60
    },
    status: {
        type: String,
        enum: ["Scheduled", "InProgress", "Completed"],
        default: "Scheduled"
    },
    expiresAt: {
        type: Date
    },
    showResultToCandidate: {
        type: Boolean,
        default: false
    },

    // ── Candidates ──
    candidates: [
        {
            candidateId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            name: { type: String, default: "" },
            email: String,
            inviteSent: {
                type: Boolean,
                default: false
            },
            status: {
                type: String,
                enum: ["Pending", "Completed"],
                default: "Pending"
            }
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Employee
        required: true
    }
}, { timestamps: true });

const InterviewSession = mongoose.model("InterviewSession", interviewSessionSchema);

export default InterviewSession;
