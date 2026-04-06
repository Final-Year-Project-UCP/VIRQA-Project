import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from backend/.env
dotenv.config({ path: path.join(__dirname, "../../.env") });

console.log("Testing email configuration...");
console.log("GOOGLE_USER:", process.env.GOOGLE_USER);
console.log("GOOGLE_APP_PASSWORD:", process.env.GOOGLE_APP_PASSWORD ? "SET" : "NOT SET");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
    process.exit(1);
  } else {
    console.log('Email server is ready to send messages');
    process.exit(0);
  }
});
