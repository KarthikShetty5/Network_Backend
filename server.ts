import express from "express";
import http from "http";
import {Server} from "socket.io";
import connection from "./middleware/mongoose";
import dotenv from 'dotenv';  // ES Module import
const app = express();
const server = http.createServer(app); // Create an HTTP server for Socket.IO
const io = new Server(server, { cors: { origin: "*" } }); // Enable CORS for Socket.IO

dotenv.config();  
// Middleware
app.use(express.json());

connection.on("connected", () => {
  console.log("Mongoose connection established.");
});

// Routes
import messageRoute from "./routes/message.route"; // New: For messaging
import profileRoute from './routes/profile.route'
import getLocationRoute from './routes/getLocation.route'
import notificationRoute from './routes/notification.route'

app.use("/api/profile", profileRoute);
app.use("/api/track", getLocationRoute);
app.use("/api/messages", messageRoute); // New route
app.use("/api/notifications", notificationRoute);

// Socket.IO for Real-Time Messaging
io.on("connection", (socket:any) => {
  console.log("User connected:", socket.id);

  // Join user to their room (room = userId)
  socket.on("join", (userId: any) => {
    console.log(`User joined room: ${userId}`);
    socket.join(userId);
  });

  // Listen for messages from clients
  socket.on("send_message", (data: { receiver: any; }) => {
    console.log("Message received:", data);
    io.to(data.receiver).emit("receive_message", data); // Emit the message to the receiver
  });

  // Handle disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Default route
app.get("/", (req: any, res: { send: (arg0: string) => any; }) => res.send("Hello World!"));

// Start server
const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Node Express Server started on port ${port}!`));

