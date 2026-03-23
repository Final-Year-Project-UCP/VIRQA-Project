

import {Admin,User} from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import generateToken from "../utils/Auth.js";
import asyncHandler from "../utils/asyncHandler.js";
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
            secure:true
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
        const user = await User.findOne({ email }).select("+password"); // Need password for compare
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
            secure:true
        }
        return res.//for getting data on front end about user
                status(200).
                cookie("token",token,options).
                json({  
                message: `User logged in successfully`,
                role: user.role,          
                })
   
} )

const logoutHandler=asyncHandler(async(req,res)=>{
    const options={
        httpOnly:true,
        secure:true
    }
return res.status(200).clearCookie("token",options).json(new ApiResponse(200,{},"Successfully LoggedOut!"))
})

export {
    registerHandler,
    LoginHandler,
    logoutHandler
}