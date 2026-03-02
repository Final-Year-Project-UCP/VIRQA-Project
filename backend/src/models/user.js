import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
            select: false, // security
        },

        role: {
            type: String,
            enum: ["admin", "employee", "candidate"],
            required: true,
        },

        // WHO CREATED THIS USER (admin or employee)
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        isFirstLogin: {
            type: Boolean,
            default: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        lastLogin: {
            type: Date,
        },

        bio: {
            type: String,
            maxLength: [250, "Bio cannot exceed 250 characters"],
        },

        phone: {
            type: String,
        },

        jobTitle: {
            type: String,
        },

        location: {
            type: String,
        },

        profilePhoto: {
            type: String,
        },

        passwordResetToken: {
            type: String,
            select: false,
        },
        passwordResetExpires: {
            type: Date,
            select: false,
        },
    },
    { timestamps: true }
);


const User = mongoose.model("User", userSchema);

export default User;
