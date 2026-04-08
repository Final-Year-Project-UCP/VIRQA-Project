import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

import {
    activationTemplate,
    employeeInviteTemplate,
    forgotPasswordTemplate,
    interviewInviteTemplate,
    interviewRescheduleTemplate
} from "../constants.js";

// Ensure your Brevo API key is stored in your .env as BREVO_API_KEY
// Ensure your registered Sender Email is GOOGLE_USER (or BREVO_SENDER_EMAIL)
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.GOOGLE_USER || "fypvirqa@gmail.com";
const SENDER_NAME = "VIRQA Platform";

const sendBrevoEmail = async (to, subject, htmlContent) => {
    if (!BREVO_API_KEY) {
        throw new Error("BREVO_API_KEY is missing from environment variables.");
    }

    try {
        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: { name: SENDER_NAME, email: SENDER_EMAIL },
                to: [{ email: to }],
                subject: subject,
                htmlContent: htmlContent
            },
            {
                headers: {
                    'accept': 'application/json',
                    'api-key': BREVO_API_KEY,
                    'content-type': 'application/json'
                },
                timeout: 10000 // 10 second timeout for responsiveness
            }
        );
        console.log(`Email sent via Brevo successfully to ${to}. MessageId:`, response.data.messageId);
        return true;
    } catch (error) {
        console.error("Brevo Email Sending Error:", error?.response?.data || error.message);
        throw error;
    }
};

const sendEmail = async (from, to, subject, activationLink) => {
    const html = activationTemplate
        .replace("{{activationLink}}", activationLink)
        .replace("{{year}}", new Date().getFullYear());

    return await sendBrevoEmail(to, subject, html);
};

export const sendEmployeeInvite = async (from, to, password) => {
    const frontendUrl = (process.env.FRONTEND_URL || "").split(",")[0]?.trim();
    const loginLink = frontendUrl ? `${frontendUrl.replace(/\/+$/, "")}/login` : "http://localhost:5173/login";

    const html = employeeInviteTemplate
        .replace("{{email}}", to)
        .replace("{{password}}", password)
        .replace("{{loginLink}}", loginLink)
        .replace("{{year}}", new Date().getFullYear());

    return await sendBrevoEmail(to, "Welcome to VIRQA - Account Credentials", html);
};

export const sendForgotPasswordOTP = async (email, otpCode) => {
    const htmlBody = forgotPasswordTemplate
        .replace("{{otpCode}}", otpCode)
        .replace("{{year}}", new Date().getFullYear());

    return await sendBrevoEmail(email, "VIRQA - Secure Password Reset OTP", htmlBody);
};

export const sendInterviewInvite = async (to, { jobTitle, date, time, duration, password }) => {
    const frontendUrl = (process.env.FRONTEND_URL || "").split(",")[0]?.trim();
    const loginLink = frontendUrl ? `${frontendUrl.replace(/\/+$/, "")}/login` : "http://localhost:5173/login";

    const html = interviewInviteTemplate
        .replace("{{jobTitle}}", jobTitle)
        .replace("{{date}}", date)
        .replace("{{time}}", time)
        .replace("{{duration}}", duration)
        .replace("{{email}}", to)
        .replace("{{password}}", password)
        .replace("{{loginLink}}", loginLink)
        .replace("{{year}}", new Date().getFullYear());

    return await sendBrevoEmail(to, `Interview Invitation: ${jobTitle} at VIRQA`, html);
};

export const sendInterviewReschedule = async (to, { jobTitle, date, time, duration }) => {
    const frontendUrl = (process.env.FRONTEND_URL || "").split(",")[0]?.trim();
    const loginLink = frontendUrl ? `${frontendUrl.replace(/\/+$/, "")}/login` : "http://localhost:5173/login";

    const html = interviewRescheduleTemplate
        .replace("{{jobTitle}}", jobTitle)
        .replace("{{date}}", date)
        .replace("{{time}}", time)
        .replace("{{duration}}", duration)
        .replace("{{loginLink}}", loginLink)
        .replace("{{year}}", new Date().getFullYear());

    return await sendBrevoEmail(to, `RESCHEDULED: Interview for ${jobTitle} at VIRQA`, html);
};

export default sendEmail;