import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true,
        trim: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        default: "General Interview"
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String, // "HH:mm" format from frontend
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
    candidates: [
        {
            candidateId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
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
