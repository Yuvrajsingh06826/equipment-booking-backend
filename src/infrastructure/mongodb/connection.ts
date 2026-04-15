import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export const ConnectToDb = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL ?? "";
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.log("Database connection failed");
    console.log(error);
  }
};