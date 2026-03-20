import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "./ApiError.js";

// Helper to get file extension from URL (like 'mp4', 'jpg', etc.)
const getFileExtension = (url) => {
  if (!url) return null;
  const lastDotIndex = url.lastIndexOf(".");
  if (lastDotIndex === -1) return null;
  return url.substring(lastDotIndex + 1).toLowerCase();
};

// This function gets the public ID from a Cloudinary URL
const extractPublicIdFromUrl = (url) => {
  if (!url) return null;

  try {
    const urlParts = url.split("/");
    const uploadIndex = urlParts.indexOf("upload");
    const publicIdParts = urlParts.slice(uploadIndex + 2);
    const publicIdWithExtension = publicIdParts.join("/");//get last .to remove extension

    const lastDotIndex = publicIdWithExtension.lastIndexOf(".");
    const publicId = lastDotIndex === -1
      ? publicIdWithExtension
      : publicIdWithExtension.substring(0, lastDotIndex);

    return publicId;
  } catch (error) {
    console.log("Error while getting public ID:", error);
    return null;
  }
};

// This function deletes the file from Cloudinary using the URL,
// automatically detecting resource_type (video or image) based on file extension
const deleteDataFromCloudinary = async (dataUrl) => {
  if (!dataUrl) {
    console.log("No image URL given.");
    throw new  ApiError(400, "No image URL provided");
  }

  const publicId = extractPublicIdFromUrl(dataUrl);
  if (!publicId) {
    console.log("Could not get public ID from the URL.");
    return;
  }

  // Detect resource type by file extension
  const ext = getFileExtension(dataUrl);

  // Common video extensions 
  const videoExtensions = ["mp4", "mov", "avi", "wmv", "flv", "mkv", "webm"];
  const resourceType = videoExtensions.includes(ext) ? "video" : "image";

  try {

    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    if (result.result !== "ok") {
      throw new ApiError(500, `Could not delete ${resourceType} from Cloudinary.`);
    }
    return result;
  } catch (error) {
    console.log(`Error deleting ${resourceType}:`, error.message);
    throw new ApiError(500, `Error deleting ${resourceType} from Cloudinary.`);
  }
};

export { deleteDataFromCloudinary };