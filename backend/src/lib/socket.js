import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    
  },
});

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Given a user ID, returns the socket ID of the corresponding connected user.
 * @param {string} userId - ID of the user to look up
 * @returns {string|null} socket ID if found, null otherwise
 */
/*******  49c7a3ea-5b43-4771-8693-e79d75c38fbc  *******/
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

//online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  //handshake
  const userId = socket.handshake.query.userId;

  //storing user’s socket ID
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});


export { io, app, server };