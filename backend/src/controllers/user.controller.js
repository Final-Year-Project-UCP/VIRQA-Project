

import {Admin,User} from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import generateToken from "../utils/Auth.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendForgotPasswordOTP } from "../utils/Email.js";
import ApiResponse from "../utils/ApiResponse.js"
const registerHandler = asyncHandler(async (req, res) => {
        const { fullName, email, password,organization} = req.body;
        if (!fullName && !email && !password && !organization) {
            throw new ApiError(400,"All fields are required" )
        }
        const user = await Admin.findOne({ email });
        if (user) {
            throw new ApiError(400,"User already exists" )
        }
        const newUser = new Admin({ fullName,password, email,organization});
        await newUser.save();
          const token = generateToken(newUser);
        const options={
            httpOnly:true,
            secure: process.env.NODE_ENV === "production"
        }
        return res.//for getting data on front end about user
                status(200).
                cookie("token",token,options).
                json({  
                message: `${newUser.fullName} registered successfully`,
                role: newUser.role,          
                name: newUser.fullName,

            })
})

const LoginHandler =asyncHandler( async (req, res) => {

        const { email, password } = req.body;
        if (!email || !password) {
            throw new ApiError(400,"All fields are required" )
        }
        let user = await User.findOne({ email }).select("+password"); // Need password for compare
        
        // Auto-seed admin logic
        if (!user && email === 'admin@virqa.com' && password === 'admin123') {
            user = new Admin({
                fullName: "System Admin",
                email: "admin@virqa.com",
                password: "admin123",
                permissions: ["all"],
                department: "Administration"
            });
            await user.save();
        }

        if (!user) {
            throw new ApiError(400,"Kindly Enter valid credentials" )
        }
        const isPasswordValid = await user.isPasswordValid(password);//custom method
        if (!isPasswordValid) {
            throw new ApiError(400,"Kindly Enter valid credentials" )
        }
        const token = generateToken(user);
        const options={
            httpOnly:true,
            secure: process.env.NODE_ENV === "production"
        }
        return res.//for getting data on front end about user
                status(200).
                cookie("token",token,options).
                json({  
                message: `User logged in successfully`,
                role: user.role,
                needsPasswordChange: user.needsPasswordChange || false
                })
   
} )

const logoutHandler=asyncHandler(async(req,res)=>{
    const options={
        httpOnly:true,
        secure: process.env.NODE_ENV === "production"
    }
return res.status(200).clearCookie("token",options).json(new ApiResponse(200,{},"Successfully LoggedOut!"))
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

export {
    registerHandler,
    LoginHandler,
    logoutHandler,
    changePasswordHandler,
    forgotPasswordHandler,
    verifyOTPHandler,
    resetPasswordHandler
}