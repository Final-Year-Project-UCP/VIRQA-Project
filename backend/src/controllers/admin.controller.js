import { Admin, Employee, Candidate, User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js";
import { deleteDataFromCloudinary } from "../utils/FileRemovalCloudinary.js";
import { uploadOnCloudinary } from "../utils/FileUploadCloudinary.js";
import sendEmail, { sendEmployeeInvite } from "../utils/Email.js";
import { ApiError } from "../utils/ApiError.js";
import { AIInterview } from "../models/aiInterview.model.js";
import InterviewSession from "../models/interviewSession.model.js";

// @desc    Get all global interviews for Admin auditing
// @route   GET /api/v1/admin/interviews
const getAllInterviews = asyncHandler(async (req, res) => {
    const interviews = await AIInterview.find()
        .populate("candidateId", "fullName email")
        .populate({
            path: "interviewSessionId",
            populate: {
                path: "createdBy",
                select: "fullName"
            }
        })
        .sort("-createdAt");

    const formattedInterviews = interviews.map(i => {
        const total = i.scores.reduce((acc, curr) => acc + curr.overallScore, 0);
        const avgScore = i.status === "completed" ? Math.round(total / (i.scores.length || 1)) : null;

        return {
            id: i._id,
            interview: i.role,
            name: i.candidateId?.fullName || "Unknown Candidate",
            createdBy: i.interviewSessionId?.createdBy?.fullName || "Direct Start",
            date: new Date(i.createdAt).toLocaleDateString(),
            time: new Date(i.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: i.status === "completed" ? "Completed" : "In Progress",
            score: avgScore,
            // Full data for PDF generation
            role: i.role,
            experience: i.experience,
            scores: i.scores,
            answers: i.answers
        };
    });

    return res.status(200).json(new ApiResponse(200, formattedInterviews, "Global interviews fetched successfully"));
});

// @desc    Get comprehensive dashboard stats for Admin
// @route   GET /api/v1/admin/dashboard-stats
const getDashboardStats = asyncHandler(async (req, res) => {
    // 1. Total Counts
    const totalEmployees = await User.countDocuments({ role: "employee" });
    const totalCandidates = await User.countDocuments({ role: "candidate" });
    const totalInterviews = await AIInterview.countDocuments();

    // 2. Fetch Recent Candidates/Interviews (Last 10)
    const recentInterviews = await AIInterview.find()
        .populate("candidateId", "fullName email profilePhoto")
        .sort("-createdAt")
        .limit(10);

    const candidates = recentInterviews.map(interview => {
        // Calculate overall score from sub-scores
        const totalScore = interview.scores.reduce((acc, curr) => acc + curr.overallScore, 0);
        const avgScore = totalScore / (interview.scores.length || 1);

        return {
            id: interview._id,
            name: interview.candidateId?.fullName || "Candidate",
            role: interview.role,
            status: interview.status === "completed" ? "Completed" : "In Progress",
            score: interview.status === "completed" ? Math.round(avgScore) : null,
            date: new Date(interview.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            })
        };
    });

    // 3. Chart Data (Average scores of last 7 completed interviews)
    const completedInterviews = await AIInterview.find({ status: "completed" })
        .populate("candidateId", "fullName")
        .sort("-createdAt")
        .limit(7);

    const chartData = {
        labels: completedInterviews.map(i => i.candidateId?.fullName?.split(" ")[0] || "User").reverse(),
        datasets: [
            {
                label: "Interview Score",
                data: completedInterviews.map(i => {
                    const total = i.scores.reduce((acc, curr) => acc + curr.overallScore, 0);
                    return Math.round(total / (i.scores.length || 1));
                }).reverse(),
                backgroundColor: "rgba(79, 70, 229, 0.5)", // indigo-500
                borderColor: "rgb(79, 70, 229)",
                borderWidth: 1,
            }
        ]
    };

    return res.status(200).json(new ApiResponse(200, {
        totalEmployees,
        totalCandidates,
        totalInterviews,
        candidates,
        chartData: completedInterviews.length > 0 ? chartData : null
    }, "Admin Dashboard stats fetched successfully"));
});

//My Profile --GET
const getProfile = asyncHandler(async (req, res) => {
    const user = await Admin.findById(req.user._id);
    if (!user) throw new ApiError(404, "Admin not found");

    return res.status(200).json(new ApiResponse(200, {
        fullName: user.fullName,
        email: user.email,
        profilePhoto: user.profilePhoto || null,
        organization: user.organization || null,
        department: user.department || null,
        professionalBio: user.professionalBio || null
    }, "Success!"));
});

//My Profile --POST
const handleProfile = asyncHandler(async (req, res) => {
    const user = await Admin.findById(req.user._id);
    if (!user) throw new ApiError(404, "Admin not found");

    // update only if values are provided
    if (req.body.fullName) user.fullName = req.body.fullName;
    if (req.body.password) user.password = req.body.password; // bcrypt by prehook
    if (req.body.department) user.department = req.body.department;
    if (req.body.organization) user.organization = req.body.organization;
    if (req.body.professionalBio) user.professionalBio = req.body.professionalBio;

    // handle profile photo
    if (req.files?.profilePhoto?.[0]) {
        const file = req.files.profilePhoto[0];
        const oldProfileUrl = user.profilePhoto;

        const url = await uploadOnCloudinary(file.path, "admins/profilePhotos");
        if (url) user.profilePhoto = url;

        // delete old profile photo if it exists
        if (oldProfileUrl) {
            try {
                await deleteDataFromCloudinary(oldProfileUrl);
            } catch (err) {
                console.log("Failed to delete old profile:", err.message);
            }
        }
    }

    await user.save();

    return res.status(200).json(new ApiResponse(200, {
        fullName: user.fullName,
        organization: user.organization || null,
        department: user.department || null,
        professionalBio: user.professionalBio || null
    }, "Success!"));
});

//Manage Employees(add employee) --POST
const addEmployee = asyncHandler(async (req, res) => {
    const { email, role } = req.body
    
    // check if employee already exists
    const existingUser = await Employee.findOne({ email });
    if (existingUser) throw new ApiError(400, "Employee with this email already exists");

    // generate temp password
    const crypto = await import("crypto");
    const tempPassword = crypto.randomBytes(4).toString("hex");

    // Create user but don't finalize yet (status Pending)
    const user = await Employee.create({
        email,
        jobTitle: role,
        password: tempPassword,
        status: "Pending", // Should be pending until they actually use the invite
        needsPasswordChange: true,
        createdBy: req.user._id
    });

    try {
        const result = await sendEmployeeInvite(process.env.GOOGLE_USER, email, tempPassword);
        if (!result) {
             throw new Error("Email service failed to send");
        }
        
        // Emit real-time event
        const io = req.app.get("io");
        if (io) io.emit("employeeAdded", user);

        return res.status(200).json(new ApiResponse(200, user, "Employee invited successfully"));
    } catch (error) {
        // CLEANUP: If email fails, delete the user so the admin can try again
        await Employee.findByIdAndDelete(user._id);
        console.error("Email Sending Error:", error.message);
        throw new ApiError(500, `Failed to send invitation email: ${error.message}. User record rolled back.`);
    }
})



//Manage Employees -- PATCH (update employee)
const updateEmployee = asyncHandler(async (req, res) => {
    const { oldEmail, email, role } = req.body;
    //check new email
    const checkEmail = await Employee.findOne({ email });
    if (checkEmail) throw new ApiError(404, "Email already exists!");
    console.log(checkEmail)
    //finding user with oldemail for updating the user
    const employee = await Employee.findOne({ email: oldEmail });
    // Update email & role
    if (email) employee.email = email;
    if (role) employee.jobTitle = role;

    await employee.save();

    // Emit real-time event
    const io = req.app.get("io");
    if (io) io.emit("employeeUpdated", employee);

    return res.status(200).json(
        new ApiResponse(200, email, "updated sucessfully")
    );
});
//Manage Employees -- DELETE (delete employee)
const deleteEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params;
    //check new email
    const employee = await Employee.findById(id);//checking if id is right or wrong
    if (!employee)
        throw new ApiError(404, "id doesnot exists!");
    // Delete from DB
    await Employee.findByIdAndDelete(id);

    // Emit real-time event
    const io = req.app.get("io");
    if (io) io.emit("employeeDeleted", id);

    return res.status(200).json({
        message: "Employee deleted permanently",
        id
    });
});


//Manage Employees --GET
const getManageEmployees = asyncHandler(async (req, res) => {
    const employees = await Employee.find({});
    return res.status(200).json(new ApiResponse(200,
        employees
        , "Success!"));

})

export {
    getProfile,
    handleProfile,
    addEmployee,
    getManageEmployees,
    updateEmployee,
    deleteEmployee,
    getDashboardStats,
    getAllInterviews
}