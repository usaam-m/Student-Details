import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import studentRoutes from "./routes/studentRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: "*" })); // Allow all origins

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api/students", studentRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
