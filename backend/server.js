import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import studentRoutes from "./routes/studentRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/college", { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/students", studentRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
