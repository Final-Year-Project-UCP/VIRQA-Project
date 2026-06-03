import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/user.model.js";

dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log("DB Connected.");
        // Find a candidate user (Muhammad Ummar)
        const user = await User.findOne({ email: "ummarmughal46@gmail.com" });
        console.log("User role:", user.role);
        console.log("User object JSON:", JSON.stringify(user, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

check();
