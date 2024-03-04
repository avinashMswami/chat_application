import express from "express";
import dotenv from "dotenv";
import routes from "./routes/Routes.js";
import connectToMongoDB from "./db/ConnectToMongoDB.js";

const app = express();
dotenv.config();

app.use(express.json())

const PORT = process.env.PORT || 5000;
app.get("/",(req,res)=>{
    res.send("Server is ready Now!!!")
})

app.use("/auth",routes);
app.listen(PORT,()=>{
    connectToMongoDB();
    console.log(`Server running on port ${PORT}`)})