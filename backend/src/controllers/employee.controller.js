//this is incomplete
import asyncHandler from "../utils/asyncHandler.js"
import { Candidate } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
const handleProfile=asyncHandler(async(req,res)=>{
    let {fullName,password}=req.body
    const userId = req.user._id;
    const candidate = await Candidate.findById(userId).select("+password");

    if (!candidate) {
        throw new ApiError(404, "Candidate not found");
    }
   console.log(candidate)
})

export default handleProfile