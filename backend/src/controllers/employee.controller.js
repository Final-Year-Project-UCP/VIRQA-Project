//this is incomplete
import asyncHandler from "../utils/asyncHandler.js"
import { Candidate,Employee,Admin } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/FileUploadCloudinary.js";
import { deleteDataFromCloudinary } from "../utils/FileRemovalCloudinary.js";
import bcrypt from "bcrypt"



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

export {handleProfile,activateAccount}