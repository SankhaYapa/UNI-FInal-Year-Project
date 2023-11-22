
import { configDotenv } from "dotenv";
import express from "express"
import mongoose from "mongoose";
import userRoute from "./routes/user.route.js"
import gigRoute from "./routes/gig.route.js";
import orderRoute from "./routes/order.route.js";
import conversationRoute from "./routes/conversation.route.js";
import messageRoute from "./routes/message.route.js";
import reviewRoute from "./routes/review.route.js";
import authRoute from "./routes/auth.route.js";
import jobRoute from "./routes/job.route.js";
 import cookieParser from "cookie-parser";
 import cors from "cors";
import courseRoute from "./routes/recommendedCourse.route.js";
const app=express()
configDotenv()

const connect =async()=>{
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to mongodb")
    } catch (error) {
      console.log(error)
    }
}
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, // Allow credentials (cookies)  
};

app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
 app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/recommendations",courseRoute);
app.use("/api/jobs",jobRoute);
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).send(errorMessage);
  });



app.listen(8800,()=>{
    connect()
    console.log("Backend server is running")
})