import mongoose from "mongoose";
import app from "../backend/src/app";
import { env } from "../backend/src/config/env";

let isConnected = false;

export default async function handler(req: any, res: any) {
  if (!isConnected) {
    try {
      await mongoose.connect(env.MONGO_URI);
      isConnected = true;
      console.log("Connected to MongoDB from Vercel Serverless Function");
    } catch (err) {
      console.error("Database connection failed inside serverless function:", err);
    }
  }
  
  // Delegate the request and response handling to the Express application
  return app(req, res);
}
