import express from "express";

import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import employeeRouter from "./routes/employee.routes.js"
import adminRouter from "./routes/admin.routes.js";
import candidateRouter from "./routes/candidate.routes.js";
import aiInterviewRouter from "./routes/aiInterview.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";
import cors from "cors";
const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"))//for static files like favicon and pdfs 

//testing
app.get('/', (req, res) => {
    res.send('<h1>The Backend is working fine due Usmans Motivations and his advanced skills <h1>')
})

app.use('/api/v1/user', authRouter);
app.use('/api/v1/employee', employeeRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/candidate', candidateRouter);
app.use('/api/v1/ai-interview', aiInterviewRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/feedback', feedbackRouter);

export default app;
