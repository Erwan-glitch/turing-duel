import { ClientToServerEvents, ServerToClientEvents } from "@/types/socket";
import { io, Socket } from "socket.io-client";
import { config } from "./config";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  config.socketUrl,
  {
    autoConnect: false,
  },
);
