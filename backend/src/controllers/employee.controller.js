//this is incomplete
import asyncHandler from "../utils/asyncHandler.js"
import { Candidate,Employee,Admin, User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/FileUploadCloudinary.js";
import { deleteDataFromCloudinary } from "../utils/FileRemovalCloudinary.js";
import bcrypt from "bcrypt"
import InterviewSession from "../models/interviewSession.model.js";
import { AIInterview } from "../models/aiInterview.model.js";

// @desc    Get dashboard statistics for the logged-in employee
// @route   GET /api/v1/employee/dashboard-stats
const getDashboardStats = asyncHandler(async (req, res) => {
    // 1. Get all sessions created by this employee
    const sessions = await InterviewSession.find({ createdBy: req.user._id })
        .populate("candidates.candidateId", "fullName email profilePhoto");

    // 2. Fetch all related AIInterviews to get live status and scores
    const aiInterviews = await AIInterview.find({
        interviewSessionId: { $in: sessions.map(s => s._id) }
    });

    // 3. Flatten and Map Candidates
    const allCandidates = [];
    sessions.forEach(session => {
        session.candidates.forEach(c => {
            // Find if there is an AI Interview for this specific candidate in this session
            const aiRecord = aiInterviews.find(ai => 
                ai.candidateId.toString() === c.candidateId?._id?.toString() && 
                ai.interviewSessionId?.toString() === session._id.toString()
            );

            let status = "Pending";
            let score = null;
            let date = new Date(session.updatedAt).toLocaleDateString();

            if (aiRecord) {
                status = aiRecord.status === "completed" ? "Completed" : "In Progress";
                // Calculate average score if completed
                if (aiRecord.status === "completed" && aiRecord.scores.length > 0) {
                    const sum = aiRecord.scores.reduce((acc, curr) => acc + curr.overallScore, 0);
                    score = Math.round(sum / aiRecord.scores.length);
                }
                date = new Date(aiRecord.updatedAt).toLocaleDateString();
            } else if (c.status === "Completed") {
                status = "Completed"; // Fallback to session status if AI record missing but marked done
            }

            allCandidates.push({
                id: c._id,
                name: c.candidateId?.fullName || "Invited Candidate",
                email: c.email,
                role: session.jobTitle,
                status,
                score,
                date
            });
        });
    });

    // 4. Aggregate Status Counts
    const stats = {
        total: allCandidates.length,
        completed: allCandidates.filter(c => c.status === "Completed").length,
        inProgress: allCandidates.filter(c => c.status === "In Progress").length,
        pending: allCandidates.filter(c => c.status === "Pending").length,
    };

    // 5. Build Chart Data (Avg score of last 7 completed)
    const completedWithScores = allCandidates
        .filter(c => c.status === "Completed" && c.score !== null)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 7)
        .reverse();

    const chartData = {
        labels: completedWithScores.map(c => c.name.split(" ")[0]),
        datasets: [
            {
                label: "Interview Score",
                data: completedWithScores.map(c => c.score),
                backgroundColor: "rgba(59, 130, 246, 0.5)",
                borderColor: "rgb(59, 130, 246)",
                borderWidth: 1,
            }
        ]
    };

    return res.status(200).json(new ApiResponse(200, {
        stats,
        candidates: allCandidates.sort((a, b) => new Date(b.date) - new Date(a.date)),
        chartData: completedWithScores.length > 0 ? chartData : null
    }, "Dashboard stats fetched successfully"));
});

//My Profile --POST
const handleProfile = asyncHandler(async (req, res) => {
    // Find the logged-in employee by ID and include the password field (normally excluded)
    const user = await Employee.findById(req.user._id).select("+password"); 
    if (!user) throw new ApiError(404, "Employee not found"); // Return error if employee does not exist

    // ------------------------
    // Password update section
    // ------------------------
    if (req.body.oldPassword) { 
        // Verify that the old password provided matches the current hashed password
        const result = await bcrypt.compare(req.body.oldPassword, user.password);
        if (!result) throw new ApiError(400, "Kindly provide valid current password");

        // Assign the new password (bcrypt hashing will be done automatically by pre-save hook)
        user.password = req.body.newPassword;
    } 

    // ------------------------
    // Update other profile fields if provided
    // ------------------------
    if (req.body.fullName) user.fullName = req.body.fullName; // Update full name
    if (req.body.department) user.department = req.body.department; // Update department
    if (req.body.professionalBio) user.professionalBio = req.body.professionalBio; // Update professional bio
    if (req.body.phoneNumber !== undefined) user.phoneNumber = req.body.phoneNumber; // Update phone number

    // ------------------------
    // Handle profile photo upload
    // ------------------------
    if (req.files?.profilePhoto?.[0]) { // Check if a new photo is uploaded
        const file = req.files.profilePhoto[0]; // Get the uploaded file
        const oldProfileUrl = user.profilePhoto; // Store the old profile photo URL

        // Upload new photo to Cloudinary
        const url = await uploadOnCloudinary(file.path, "employees/profilePhotos");
        if (url) user.profilePhoto = url; // Update the user's profile photo with the new URL

        // Delete old profile photo from Cloudinary if it exists
        if (oldProfileUrl) {
            try {
                await deleteDataFromCloudinary(oldProfileUrl);
            } catch (err) {
                console.log("Failed to delete old profile:", err.message);
            }
        }
    }

    // ------------------------
    // Save the updated user to the database
    // ------------------------
    await user.save();

    // ------------------------
    // Return the updated profile data as a response
    // ------------------------
    return res.status(200).json(new ApiResponse(200, {
        fullName: user.fullName,
        organization: user.organization || null,
        jobTitle: user.jobTitle || null,
        professionalBio: user.professionalBio || null
    }, "Success!"));
});


//My Profile -- GET
const getProfile = asyncHandler(async (req, res) => {
    const user = await Employee.findById(req.user._id);
    if (!user) throw new ApiError(404, "Employee not found");

    return res.status(200).json(new ApiResponse(200, {
        fullName: user.fullName || "",
        email: user.email,
        jobTitle: user.jobTitle || "",
        department: user.department || "",
        phoneNumber: user.phoneNumber || "",
        professionalBio: user.professionalBio || "",
        profilePhoto: user.profilePhoto || null,
        status: user.status,
        createdAt: user.createdAt
    }, "Success!"));
});


//Manage Employees (activate account) --POST
const activateAccount=asyncHandler(async(req,res)=>{
const {token,password}=req.body
 if(!token || !password) throw new ApiError(500,"Token or password is missing!")
 const employee = await Employee.findOne({
  verificationToken: token,//on basis of token
  verificationTokenExpires: { $gt: Date.now() }//verificationToken = token AND verificationTokenExpires > current time
});
if (!employee) {
  throw new ApiError(400, "Invalid or expired token");
}
employee.password = password;
employee.status = "Verified";
employee.verificationToken = null;
employee.verificationTokenExpires = null;

await employee.save();
 return res.status(200).json( new ApiResponse(200,"account activated successfuly!",{}));
})

export { handleProfile, activateAccount, getProfile, getDashboardStats }