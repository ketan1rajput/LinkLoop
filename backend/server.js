import express from "express";
import dotenv from "dotenv";
const app = express();
import authRoutes from "./routes/auth.routes.js"
import connectMongoDB from "./db/connectMongoDB.js";
import cookieParser from "cookie-parser";
dotenv.config();
const PORT = process.env.PORT || 5000;

//middleware is a function that runs between request and response
app.use(express.json());  //to parse req.body - form data which is coming from react
app.use(express.urlencoded({ extended: true })) //to parse from data(urlencoded)
app.use(cookieParser());
//app.get looks for a callback fuction and app.use can handle post, get, put etc...
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running in ${PORT}`);
  connectMongoDB();
});