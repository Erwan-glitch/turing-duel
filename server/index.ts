import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { registerHandlers } from "./sockets/handler";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  registerHandlers(io, socket);
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
