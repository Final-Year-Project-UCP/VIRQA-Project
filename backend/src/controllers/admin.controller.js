import { Admin } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js";
import { deleteDataFromCloudinary } from "../utils/FileRemovalCloudinary.js";
import { uploadOnCloudinary } from "../utils/FileUploadCloudinary.js";

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

export {
    getProfile,
    handleProfile
}