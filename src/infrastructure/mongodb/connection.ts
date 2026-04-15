import mongoose from "mongoose";
import dotenv from "dotenv";
import { logError, logInfo } from "../../utils/logger";

dotenv.config({ path: ".env.local" });

export const ConnectToDb = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL ?? "";
    await mongoose.connect(mongoUrl);
    logInfo("Connected to MongoDB Atlas");
  } catch (error) {
    logError("Database connection failed");
    console.log(error);
  }
};