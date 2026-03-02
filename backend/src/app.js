import express from "express";
import userRouter from "./routes/user.js";
import cookieParser from "cookie-parser";


const app = express();

app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//testing
app.get('/', (req, res) => {
    res.send('<h1>The Backend is working fine due to Usmans prayers')
})

app.use('/api/v1/user', userRouter);



export default app;
