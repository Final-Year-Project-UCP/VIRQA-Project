import express from "express";

import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import employeeRouter from "./routes/employee.routes.js"
import adminRouter from "./routes/admin.routes.js";
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


export default app;
