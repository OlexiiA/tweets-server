import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";

import authRoute from "./routes/auth.js";
import tweetsRoute from "./routes/tweet.js";
import commentsRoute from "./routes/comment.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 4444;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const corsOptions = {
  origin: "https://tweets-api-sztu.onrender.com", 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
};

app.use(cors(corsOptions));
app.use(fileUpload());
app.use(express.json());
app.use(express.static("uploads"));

app.use("/api/auth", authRoute);
app.use("/api/tweets", tweetsRoute);
app.use("/api/comments", commentsRoute);

async function start() {
  try {
    await mongoose
      .connect(
        `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.sqn0y4c.mongodb.net/${DB_NAME}`
      )
      .then(() => console.log("DB is work"))
      .catch((error) => console.log(`DB error`, error));
    app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
  } catch (error) {
    console.log(error);
  }
}
start();
