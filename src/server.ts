import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import { connectionDB } from "./config/connectioDB";
import { corsOptions } from "./config/cors";
import authRoutes from "./routes/authRoutes";

// Load environment variables from.env file
dotenv.config();

// Connect to MongoDB
connectionDB();

// Middleware
const app = express();
app.use(cors(corsOptions));
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);

export default app;