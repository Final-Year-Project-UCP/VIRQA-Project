// it is a wrapper for standardize instead of writing try and catch every where

const asyncHandler=(fn)=>{
    return async(req,res,next)=>{
        try{
            await fn(req,res,next)
        }
        catch(err){
            res.status(err.statusCode||500).json({
                success:false,
                message:err.message
            })
        }
    }
}
export default asyncHandler