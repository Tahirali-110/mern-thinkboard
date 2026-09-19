import express from 'express';
import notesRoute from './routes/notesRoutes.js';
import {connectDB} from './config/db.js';
import dotenv from 'dotenv';
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import rateLimiter from "./middleware/rateLimiter.js";


import cors from 'cors';

import path from "path";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5001;
const __dirname= path.resolve()

if(process.env.NODE_ENV !== "production"){

app.use(cors(
{
    origin: 'http://localhost:5173', // Allow requests from this origin
})); // Enable CORS for all routes
}

//middleware
app.use(express.json());//middleware to parse incoming JSON requests

app.use(rateLimiter)// Apply the rate limiter middleware to all routes



//our simple custom middleware to log the request method and url for every incoming request. This is useful for debugging and monitoring purposes.

// app.use((req, res, next) => {
//   console.log(`Req method is ${req.method} & Req url is ${req.url}`);
//   next();
// });
app.use("/api/notes",notesRoute);


if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

app.get("*",(req,res) =>{
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
});
}

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is started on PORT:", PORT);
    });
});




//mongodb+srv://syedtahirali721_db_user:7F8hxRif2BNI5Vqm@cluster0.cwdfqwa.mongodb.net/?appName=Cluster0