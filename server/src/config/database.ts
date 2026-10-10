
import dns from "node:dns";
import mongoose from "mongoose";

export async function connectDatabase(): Promise<void> {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error("MONGODB_URI is missing from server/.env");
  }

  // Temporary DNS workaround for local development
  dns.setServers(["8.8.8.8", "1.1.1.1"]);

  try {
    console.log("Connecting to MongoDB Atlas...");

    await mongoose.connect(mongoURI, {
      dbName: "clientflow",
      serverSelectionTimeoutMS: 15000,
    });

    console.log("MongoDB Atlas connected successfully");
  } catch (error: unknown) {
    console.error("MongoDB connection failed");

    if (error instanceof Error) {
      console.error("Error type:", error.name);

      const details = error as Error & {
        reason?: {
          servers?: Map<
            string,
            {
              error?: {
                message?: string;
              };
            }
          >;
        };
      };

      if (details.reason?.servers) {
        for (const [server, description] of
          details.reason.servers.entries()) {
          console.error("Server:", server);
          console.error(
            "Reason:",
            description.error?.message ?? "No detailed error"
          );
        }
      } else {
        console.error(
          "Reason:",
          error.message.replaceAll(mongoURI, "[REDACTED]")
        );
      }
    }

    throw new Error("Unable to connect to MongoDB Atlas");
  }
}
