import mongoose from "mongoose";
export async function connectDatabase() {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
        throw new Error("MONGODB_URI is missing from .env");
    }
    await mongoose.connect(mongoURI, {
        dbName: "clientflow",
        serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB Atlas connected successfully");
}
