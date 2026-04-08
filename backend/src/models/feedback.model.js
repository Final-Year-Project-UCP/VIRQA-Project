import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
    {
        candidateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        interviewSessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InterviewSession",
            required: false,
            default: null
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        category: {
            type: String,
            default: "Interview Experience"
        },
        message: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);
