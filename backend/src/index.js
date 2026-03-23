import dotenv from "dotenv";
dotenv.config()
import app from "./app.js";
import connectDB from "./db/db_connect.js";


if (!process.env.MONGODB_URI || !process.env.DB_NAME) {
  console.error('Missing environment variables: MONGODB_URI and DB_NAME must be set in backend/.env');
  process.exit(1);
}
if (!process.env.CLOUDINARY_CLOUD_NAME|| !process.env.CLOUDINARY_API_KEY) {
  console.error('Missing environment variables: CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY must be set in backend/.env');
  process.exit(1);
}
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });

