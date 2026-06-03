import mongoose from "mongoose";
import dotenv from "dotenv";
import { Candidate } from "../src/models/user.model.js";

dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log("DB Connected.");
        const candidates = await Candidate.find({});
        console.log("Found candidates:", candidates.length);
        candidates.forEach(c => {
            console.log(`Candidate Name: ${c.fullName}, Email: ${c.email}, resumeUrl: ${c.resumeUrl}`);
        });
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

check();
