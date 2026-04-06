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

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});
// Verify that if the transporter can connect to the mail server
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});
const sendEmail = async (from,to, subject,activationLink) => {
  const mailOptions = createMailOptions(from,to, subject, activationLink);
  const info = await transporter.sendMail(mailOptions);//actual sending of the email
  console.log("Email sent successfully!",info);
  return info.accepted.length > 0;//{accepted: ['user@gmail.com'],rejected: [],messageId: '<abc123@gmail.com>'
};

export const sendEmployeeInvite = async (from, to, password) => {
  try {
    const loginLink = "http://localhost:5173/login";
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
    const info = await transporter.sendMail(mailOptions);
    console.log("Invite email sent successfully:", info.messageId);
    return info.accepted.length > 0;
  } catch (error) {
    console.error("Nodemailer Error (sendEmployeeInvite):", error);
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
    
    const info = await transporter.sendMail(mailOptions);
    return info.accepted.length > 0;
};

export const sendInterviewInvite = async (to, { jobTitle, date, time, duration, password }) => {
  const loginLink = "http://localhost:5173/login";
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
  const info = await transporter.sendMail(mailOptions);
  return info.accepted.length > 0;
};

export const sendInterviewReschedule = async (to, { jobTitle, date, time, duration }) => {
  const loginLink = "http://localhost:5173/login";
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
  const info = await transporter.sendMail(mailOptions);
  return info.accepted.length > 0;
};

export default sendEmail;