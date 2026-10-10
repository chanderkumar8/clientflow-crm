import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import { connectDatabase } from "./config/database.js";
const app = express();
const PORT = Number(process.env.PORT) || 5000;
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.get("/api/health", (_req, res) => {
    const isConnected = mongoose.connection.readyState === 1;
    res.status(isConnected ? 200 : 503).json({
        success: isConnected,
        application: "ClientFlow CRM",
        database: isConnected ? "Connected" : "Disconnected",
        message: isConnected
            ? "ClientFlow API and MongoDB are running"
            : "MongoDB is unavailable",
    });
});
async function startServer() {
    try {
        console.log("Connecting to MongoDB Atlas...");
        await connectDatabase();
        app.listen(PORT, () => {
            console.log(`ClientFlow API running at http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Database connection failed:", error instanceof Error ? error.message : "Unknown error");
        process.exitCode = 1;
    }
}
void startServer();
