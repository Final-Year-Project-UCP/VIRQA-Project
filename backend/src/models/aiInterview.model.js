import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema({
    text: { type: String, required: true },
    askedAt: { type: Date, default: Date.now },
});

const answerSchema = new Schema({
    questionText: { type: String, required: true },
    transcribedText: { type: String, required: true },
    answeredAt: { type: Date, default: Date.now },
});

const scoreSchema = new Schema({
    questionText: { type: String, required: true },
    semanticScore: { type: Number, required: true, min: 0, max: 100 },
    technicalScore: { type: Number, required: true, min: 0, max: 100 },
    overallScore: { type: Number, required: true, min: 0, max: 100 },
    feedback: { type: String, required: true },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
});

const aiInterviewSchema = new Schema({
    // Using reference to 'User' assuming candidate is a User.
    candidateId: {
        type: Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    // Reference to the scheduled interview session this AI interview belongs to
    interviewSessionId: {
        type: Schema.Types.ObjectId,
        ref: "InterviewSession",
        required: false 
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    candidateName: {
        type: String,
        default: "Candidate",
        trim: true
    },
    experience: {
        type: String,
        required: true,
        trim: true
    },
    currentDifficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "medium"
    },
    status: {
        type: String,
        enum: ["ongoing", "completed"],
        default: "ongoing"
    },
    questions: [questionSchema],
    answers: [answerSchema],
    scores: [scoreSchema],
    finalReport: {
        type: String
    }
}, {
    timestamps: true
});

export const AIInterview = mongoose.model("AIInterview", aiInterviewSchema);
