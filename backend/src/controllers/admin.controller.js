import { Admin, Employee } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js";
import { deleteDataFromCloudinary } from "../utils/FileRemovalCloudinary.js";
import { uploadOnCloudinary } from "../utils/FileUploadCloudinary.js";
import sendEmail from "../utils/Email.js";
import { ApiError } from "../utils/ApiError.js";
import e from "express";

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
const addEmployee=asyncHandler(async(req,res)=>{
//search 
const {email,role}=req.body
  // check if employee already exists
 const existingUser=await Employee.findOne({email});
 if (existingUser) throw new ApiError(400, "employee already exists");
 // create activation token
  const crypto = await import("crypto");
  const token = crypto.randomBytes(32).toString("hex");

  // save employee in DB
  const user=await Employee.create({
    email,
    jobTitle:role,
    status: "Pending",
    verificationToken: token,
    createdBy:req.user._id,
    verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  });
   await user.save({ validateBeforeSave: false });
  // activation link
  const activationLink = `http://localhost:5173/activate-account?token=${token}`;

 const result=await sendEmail(process.env.GOOGLE_USER,email, "EMPLOYEE", activationLink)
 if(!result) throw new ApiError(500,"Error! in sending email")

  return res.status(200).json({
    message: "Employee invited successfully",
    activationLink
  });
})



//Manage Employees -- PATCH (update employee)
const updateEmployee = asyncHandler(async (req, res) => {
    const { oldEmail, email, role } = req.body;
    //check new email
    const checkEmail = await Employee.findOne({email});
    if (checkEmail ) throw new ApiError(404, "Email already exists!");
    console.log(checkEmail)
    //finding user with oldemail for updating the user
    const employee = await Employee.findOne({email:oldEmail});
    // Update email & role
    if (email) employee.email = email;
    if (role) employee.jobTitle = role;
    
    await employee.save();
    return res.status(200).json(
        new ApiResponse(200,email,"updated sucessfully") 
    );
});
//Manage Employees -- DELETE (delete employee)
const deleteEmployee = asyncHandler(async (req, res) => {
    const {  id } = req.params;
    //check new email
    const employee = await Employee.findById(id);//checking if id is right or wrong
    if (!employee)
         throw new ApiError(404, "id doesnot exists!");
       // Delete from DB
    await Employee.findByIdAndDelete(id);
    return res.status(200).json({
        message: "Employee deleted permanently",
        id
    });
});


//Manage Employees --GET
const getManageEmployees=asyncHandler(async(req,res)=>{
  const employees=await Employee.find({});
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
    deleteEmployee
}