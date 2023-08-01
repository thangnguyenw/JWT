import express  from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/connectDB.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";

dotenv.config();

const app = express();

// connect to database
db.connect()

app.use(cors());
app.use(cookieParser());
app.use(express.json());
 
// Routes
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}`);
})

// json web token