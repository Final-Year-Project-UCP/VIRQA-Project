
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

    const uploadOnCloudinary=async function(filePath,folder){
     try{
      if(!filePath)  throw new Error("File path is required for Cloudinary upload.");
      cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });
      const response= await cloudinary.uploader.upload(filePath,{
        resource_type:"auto",
        folder:folder||"default"//on which folder of cloudinary data stored
       })
       
     fs.unlinkSync(filePath)//delete file from server
     return response.secure_url
   }
   catch(err){
    console.log(err)
    fs.unlinkSync(filePath)//remove the tenporary file on server
     return null
   }
}
export {uploadOnCloudinary}