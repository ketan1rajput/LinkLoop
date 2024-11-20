import express from "express";
import dotenv from "dotenv";
const app = express();
import authRoutes from "./routes/auth.routes.js"
import connectMongoDB from "./db/connectMongoDB.js";
const PORT = 3000;
dotenv.config();


//app.get looks for a callback fuction and app.use can handle post, get, put etc...
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running in ${PORT}`);
    connectMongoDB();
})