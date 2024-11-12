import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import {connectDB} from './utils/db.js'
import userRoute from './routes/user.route.js';
import messageRoute from './routes/message.route.js';
import postRoute from './routes/post.route.js';
dotenv.config({})
const app = express();
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
 
}

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());


app.use('/api/v1/user',userRoute)
app.use('/api/v1/message',messageRoute)
app.use('/api/v1/postRoute',postRoute)
app.get("/",(req,res)=>{
    return res.status(200).json({
        message: "Welcome to our API",
        success:true,
    })
})

app.get("/home",(req,res)=>{
    return res.status(200).json({
        message: "Welcome to our Home",
        success:true,
    })
})
 
app.listen(process.env.PORT,()=>{
    connectDB()
    console.log(`Starting server on port`)
})

