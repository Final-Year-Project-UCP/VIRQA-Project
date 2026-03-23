import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import { activationTemplate } from "../constants.js";
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

export default sendEmail;