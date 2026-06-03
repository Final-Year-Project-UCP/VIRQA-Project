

import { Admin, User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import generateToken from "../utils/Auth.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendForgotPasswordOTP } from "../utils/Email.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/FileUploadCloudinary.js";
import { deleteDataFromCloudinary } from "../utils/FileRemovalCloudinary.js";
const registerHandler = asyncHandler(async (req, res) => {
    const { fullName, email, password, organization } = req.body;
    if (!fullName && !email && !password && !organization) {
        throw new ApiError(400, "All fields are required")
    }
    const user = await Admin.findOne({ email });
    if (user) {
        throw new ApiError(400, "User already exists")
    }
    const newUser = new Admin({ fullName, password, email, organization });
    await newUser.save();
    const token = generateToken(newUser);
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }
    return res.//for getting data on front end about user
        status(200).
        cookie("token", token, options).
        json({
            message: `${newUser.fullName} registered successfully`,
            role: newUser.role,
            name: newUser.fullName,

        })
})

const LoginHandler = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    // Find user in DB
    let user = await User.findOne({ email }).select("+password");

    // Static Admin Bypass & Auto-Seed
    if (email === "admin@virqa.com" && password === "admin123") {
        if (!user) {
            user = new Admin({
                fullName: "System Admin",
                email: "admin@virqa.com",
                password: "admin123", // hashed by pre-save hook
                permissions: ["all"],
                department: "Administration",
            });
            await user.save();
        }
        // Skip bcrypt check for static admin
    } else {
        // Regular user login
        if (!user) {
            throw new ApiError(400, "Kindly enter valid credentials");
        }
        const isPasswordValid = await user.isPasswordValid(password);
        if (!isPasswordValid) {
            throw new ApiError(400, "Kindly enter valid credentials");
        }
    }

    // Generate JWT token
    const token = generateToken(user);

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    // Send token in response body AND cookie (cookie supports cross-site auth in prod)
    return res
        .status(200)
        .cookie("token", token, cookieOptions)
        .json({
        message: "User logged in successfully",
        role: user.role,
        token: token, // send token here
        needsPasswordChange: user.needsPasswordChange || false,
        name: user.fullName,
    });
});



const logoutHandler = asyncHandler(async (req, res) => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };
    return res
        .status(200)
        .clearCookie("token", cookieOptions)
        .json(new ApiResponse(200, {}, "Successfully LoggedOut!"))
})

const changePasswordHandler = asyncHandler(async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword) {
        throw new ApiError(400, "New Password is required");
    }

    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, "User not found");

    user.password = newPassword;
    user.needsPasswordChange = false;
    await user.save();

    return res.status(200).json(new ApiResponse(200, {}, "Password updated successfully!"));
});

const forgotPasswordHandler = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new ApiError(400, "Email is required");

    const user = await User.findOne({ email });
    if (!user) {
        // Obfuscate if the user doesn't exist for security
        return res.status(200).json(new ApiResponse(200, {}, "If an account matches, an OTP has been sent."));
    }

    // Generate 6 digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save strictly to DB with 10 min expiry
    user.resetPasswordOTP = otpCode;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendForgotPasswordOTP(email, otpCode);

    return res.status(200).json(new ApiResponse(200, {}, "If an account matches, an OTP has been sent."));
});

const verifyOTPHandler = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) throw new ApiError(400, "Email and OTP are required");

    const user = await User.findOne({
        email,
        resetPasswordOTP: otp,
        resetPasswordExpires: { $gt: Date.now() }
    }).select("+resetPasswordOTP +resetPasswordExpires");

    if (!user) {
        throw new ApiError(400, "OTP is invalid or has expired");
    }

    // We do not clear it yet, because they still need to submit the new password
    return res.status(200).json(new ApiResponse(200, {}, "OTP verified successfully!"));
});

const resetPasswordHandler = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) throw new ApiError(400, "All fields are required");

    const user = await User.findOne({
        email,
        resetPasswordOTP: otp,
        resetPasswordExpires: { $gt: Date.now() }
    }).select("+resetPasswordOTP +resetPasswordExpires");

    if (!user) {
        throw new ApiError(400, "OTP is invalid or has expired");
    }

    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;

    // Automatically flag that they've secured their account so no force-reset happens
    user.needsPasswordChange = false;

    await user.save();

    return res.status(200).json(new ApiResponse(200, {}, "Password reset successfully!"));
});

// @desc    Get current user profile
// @route   GET /api/v1/user/profile
const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, "User not found");

    return res.status(200).json(new ApiResponse(200, user, "Profile fetched successfully"));
});

// @desc    Update user profile
// @route   PATCH /api/v1/user/profile
const updateProfile = asyncHandler(async (req, res) => {
    const {
        fullName, phoneNumber, professionalBio, organization, location,
        skills, experience, level, jobTitle, department,
        educations, resumeUrl
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, "User not found");

    // Update base fields
    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (professionalBio) user.professionalBio = professionalBio;
    if (organization) user.organization = organization;
    if (location) user.location = location;

    // Update Role-specific fields
    if (user.role === 'candidate') {
        if (skills !== undefined) {
            user.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;
        }
        if (experience !== undefined) user.experience = experience;
        if (level) user.level = level;
        if (jobTitle) user.jobTitle = jobTitle;
        if (educations !== undefined) {
            user.educations = typeof educations === 'string' ? JSON.parse(educations) : educations;
        }
        
        // Handle deletion of old resume if resumeUrl is explicitly cleared (set to empty)
        if (resumeUrl === "" && user.resumeUrl) {
            try {
                await deleteDataFromCloudinary(user.resumeUrl);
            } catch (err) {
                console.log("Failed to delete old resume from Cloudinary:", err.message);
            }
            user.resumeName = "";
            user.resumeSize = "";
        }
        if (resumeUrl !== undefined) user.resumeUrl = resumeUrl;
    } else if (user.role === 'employee') {
        if (jobTitle) user.jobTitle = jobTitle;
        if (department) user.department = department;
    } else if (user.role === 'admin') {
        if (department) user.department = department;
    }

    // Handle profile photo upload
    if (req.files?.profilePhoto?.[0]) {
        const file = req.files.profilePhoto[0];
        const oldProfileUrl = user.profilePhoto;

        const url = await uploadOnCloudinary(file.path, "candidates/profilePhotos");
        if (url) user.profilePhoto = url;

        if (oldProfileUrl) {
            try {
                await deleteDataFromCloudinary(oldProfileUrl);
            } catch (err) {
                console.log("Failed to delete old profile photo:", err.message);
            }
        }
    }

    // Handle resume file upload
    if (req.files?.resume?.[0]) {
        const file = req.files.resume[0];
        const oldResumeUrl = user.resumeUrl;

        const url = await uploadOnCloudinary(file.path, "candidates/resumes");
        if (url) {
            user.resumeUrl = url;
            user.resumeName = file.originalname;
            user.resumeSize = `${(file.size / 1024).toFixed(1)} KB`;
        }

        if (oldResumeUrl) {
            try {
                await deleteDataFromCloudinary(oldResumeUrl);
            } catch (err) {
                console.log("Failed to delete old resume from Cloudinary:", err.message);
            }
        }
    }

    await user.save();

    return res.status(200).json(new ApiResponse(200, user, "Profile updated successfully"));
});

export {
    registerHandler,
    LoginHandler,
    logoutHandler,
    changePasswordHandler,
    forgotPasswordHandler,
    verifyOTPHandler,
    resetPasswordHandler,
    getProfile,
    updateProfile
}