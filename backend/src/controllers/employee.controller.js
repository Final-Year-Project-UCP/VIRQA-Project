

//this is incomplete
import asyncHandler from "../utils/asyncHandler.js"
import { Candidate,Employee,Admin } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
const handleProfile=asyncHandler(async(req,res)=>{
    let {fullName,password}=req.body
    const userId = req.user._id;
    const candidate = await Candidate.findById(userId).select("+password");

    if (!candidate) {
        throw new ApiError(404, "Candidate not found");
    }
   console.log(candidate)
})


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