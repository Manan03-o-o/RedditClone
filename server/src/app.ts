/// <reference path="./types/express.d.ts" />
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import communityRoutes from "./routes/communityRoutes";
import postRoutes from "./routes/postRoutes";
import voteRoutes from "./routes/voteRoutes";
import commentRoutes from "./routes/commentRoutes";
import { errorMiddleware } from "./middleware/errorMiddleware";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/vote", voteRoutes);
app.use("/api/comments", commentRoutes);

// Error handling
app.use(errorMiddleware);

export default app;
