import { ClientToServerEvents, ServerToClientEvents } from "@/types/socket";
import { io, Socket } from "socket.io-client";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://192.168.1.21:3001",
  {
    autoConnect: false,
  },
);
