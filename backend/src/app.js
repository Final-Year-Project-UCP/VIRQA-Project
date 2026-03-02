import express from "express";
const app = express();

app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));


//testing
app.get('/',(req,res)=>{
    res.send('<h1>The Backend is working fine due to Usmans prayers')
})


export default app;
