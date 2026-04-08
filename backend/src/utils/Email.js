import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import { 
    activationTemplate, 
    employeeInviteTemplate, 
    forgotPasswordTemplate, 
    interviewInviteTemplate, 
    interviewRescheduleTemplate 
} from "../constants.js";
const createMailOptions = (from,to, subject,activationLink ) => {
  return {
    from,// sender email
    to, // receiver email
    subject,//email subject
    html: activationTemplate
    .replace("{{activationLink}}", activationLink)
    .replace("{{year}}", new Date().getFullYear()),
  };
};

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_SECURE =
  (process.env.SMTP_SECURE || "").toLowerCase() === "true"
    ? true
    : (process.env.SMTP_SECURE || "").toLowerCase() === "false"
      ? false
      : SMTP_PORT === 465;

// Keep API responsive in production: fail fast instead of hanging ~60s on blocked SMTP.
const SMTP_CONNECTION_TIMEOUT_MS = Number(process.env.SMTP_CONNECTION_TIMEOUT_MS || 12_000);
const SMTP_SOCKET_TIMEOUT_MS = Number(process.env.SMTP_SOCKET_TIMEOUT_MS || 12_000);

const transporter = nodemailer.createTransport({
  // If you deploy to a host that blocks outbound SMTP, this will time out fast.
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
  connectionTimeout: SMTP_CONNECTION_TIMEOUT_MS,
  socketTimeout: SMTP_SOCKET_TIMEOUT_MS,
  greetingTimeout: SMTP_CONNECTION_TIMEOUT_MS,
});

// Verify transport only outside production (it can also hang on blocked ports).
if (process.env.NODE_ENV !== "production") {
  transporter.verify((error) => {
    if (error) {
      console.error("Error connecting to email server:", error);
    } else {
      console.log("Email server is ready to send messages");
    }
  });
}

function withTimeout(promise, ms, label) {
  if (!ms || ms <= 0) return promise;
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}
const sendEmail = async (from,to, subject,activationLink) => {
  const mailOptions = createMailOptions(from,to, subject, activationLink);
  const info = await withTimeout(
    transporter.sendMail(mailOptions), // actual sending of the email
    SMTP_SOCKET_TIMEOUT_MS,
    "sendEmail"
  );
  console.log("Email sent successfully!",info);
  return info.accepted.length > 0;//{accepted: ['user@gmail.com'],rejected: [],messageId: '<abc123@gmail.com>'
};

export const sendEmployeeInvite = async (from, to, password) => {
  try {
    const frontendUrl = (process.env.FRONTEND_URL || "").split(",")[0]?.trim();
    const loginLink = frontendUrl ? `${frontendUrl.replace(/\/+$/, "")}/login` : "http://localhost:5173/login";
    const html = employeeInviteTemplate
      .replace("{{email}}", to)
      .replace("{{password}}", password)
      .replace("{{loginLink}}", loginLink)
      .replace("{{year}}", new Date().getFullYear());

    const mailOptions = {
      from: from || process.env.GOOGLE_USER,
      to,
      subject: "Welcome to VIRQA - Account Credentials",
      html
    };
    
    console.log(`Attempting to send invite email to: ${to}`);
    const info = await withTimeout(
      transporter.sendMail(mailOptions),
      SMTP_SOCKET_TIMEOUT_MS,
      "sendEmployeeInvite"
    );
    console.log("Invite email sent successfully:", info.messageId);
    return info.accepted.length > 0;
  } catch (error) {
    console.error("Nodemailer Error (sendEmployeeInvite):", {
      message: error?.message,
      code: error?.code,
      command: error?.command,
      response: error?.response,
      responseCode: error?.responseCode,
      stack: process.env.NODE_ENV !== "production" ? error?.stack : undefined,
    });
    throw error; // Rethrow to be caught by the controller
  }
};

export const sendForgotPasswordOTP = async (email, otpCode) => {
    const year = new Date().getFullYear();
    const htmlBody = forgotPasswordTemplate
        .replace("{{otpCode}}", otpCode)
        .replace("{{year}}", year);

    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to: email,
        subject: "VIRQA - Secure Password Reset OTP",
        html: htmlBody
    };
    
    const info = await withTimeout(
      transporter.sendMail(mailOptions),
      SMTP_SOCKET_TIMEOUT_MS,
      "sendForgotPasswordOTP"
    );
    return info.accepted.length > 0;
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

  const mailOptions = {
    from: process.env.GOOGLE_USER,
    to,
    subject: `Interview Invitation: ${jobTitle} at VIRQA`,
    html
  };
  const info = await withTimeout(
    transporter.sendMail(mailOptions),
    SMTP_SOCKET_TIMEOUT_MS,
    "sendInterviewInvite"
  );
  return info.accepted.length > 0;
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

  const mailOptions = {
    from: process.env.GOOGLE_USER,
    to,
    subject: `RESCHEDULED: Interview for ${jobTitle} at VIRQA`,
    html
  };
  const info = await withTimeout(
    transporter.sendMail(mailOptions),
    SMTP_SOCKET_TIMEOUT_MS,
    "sendInterviewReschedule"
  );
  return info.accepted.length > 0;
};

export default sendEmail;