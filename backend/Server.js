import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import connectToMongoDB from "./db/ConnectToMongoDB.js";
import messageRoutes from "./routes/messageRoutes.js";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();

app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT || 5000;
app.get("/",(req,res)=>{
    res.send("Server is ready Now!!!")
})

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes)
app.listen(PORT,()=>{
    connectToMongoDB();
    console.log(`Server running on port ${PORT}`)})