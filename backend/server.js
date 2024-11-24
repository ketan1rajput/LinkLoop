import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import postRoutes from "./routes/post.routes.js";

import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express();
const PORT = process.env.PORT || 5000;

//middleware is a function that runs between request and response
app.use(express.json());  //to parse req.body - form data which is coming from react
app.use(express.urlencoded({ extended: true })) //to parse from data(urlencoded)
app.use(cookieParser());
//app.get looks for a callback fuction and app.use can handle post, get, put etc...
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
  console.log(`Server is running in ${PORT}`);
  connectMongoDB();
});