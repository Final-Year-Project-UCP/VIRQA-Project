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

app.set("trust proxy", 1);

const allowedOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

console.log("CORS: Allowed Origins:", allowedOrigins.length > 0 ? allowedOrigins : "ALL (Warning: No FRONTEND_URL set)");

app.use(
    cors({
        origin: (origin, cb) => {
            // allow non-browser clients (no Origin header)
            if (!origin) return cb(null, true);
            
            // If no FRONTEND_URL is set, allow all in dev (but we should encourage setting it)
            if (allowedOrigins.length === 0) return cb(null, true);

            const isAllowed = allowedOrigins.some(allowed => 
                origin === allowed || 
                (allowed.endsWith('/') ? origin === allowed.slice(0, -1) : origin === allowed + '/')
            );

            if (isAllowed) {
                cb(null, true);
            } else {
                console.warn(`CORS: Origin ${origin} blocked. Allowed: ${allowedOrigins.join(", ")}`);
                cb(new Error(`CORS blocked origin: ${origin}`));
            }
        },
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    })
);
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
