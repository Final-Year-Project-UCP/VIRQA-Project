import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connectDB from "./db/db_connect.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { registerInterviewSocketHandlers } from "./sockets/interview.socket.js";

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: (process.env.FRONTEND_URL || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Client connected via socket.io:", socket.id);

  // Join a private room for targeted notifications
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their private notification room.`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Register interview-specific socket logic
registerInterviewSocketHandlers(app, io);


if (!process.env.MONGODB_URI || !process.env.DB_NAME) {
  console.error('Missing environment variables: MONGODB_URI and DB_NAME must be set in backend/.env');
  process.exit(1);
}
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
  console.error('Missing environment variables: CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY must be set in backend/.env');
  process.exit(1);
}
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    httpServer.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });

