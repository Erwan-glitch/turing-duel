import { Server, Socket } from "socket.io";
import { createGame, getGame } from "../game/gameManager";

const waitingQueue: string[] = []; // socket ids waiting for opponent
let roomCounter = 1;

export function registerHandlers(io: Server, socket: Socket) {
  console.log("User connected:", socket.id);

  socket.on("find_match", () => {
    waitingQueue.push(socket.id);

    console.log("Waiting queue:", waitingQueue);

    if (waitingQueue.length >= 2) {
      const player1 = waitingQueue.shift()!;
      const player2 = waitingQueue.shift()!;

      const roomId = `room${roomCounter++}`;

      const players = [player1, player2];

      players.forEach((p) => {
        const playerSocket = io.sockets.sockets.get(p);
        playerSocket?.join(roomId);
      });

      const game = createGame(roomId, players);

      io.to(roomId).emit("game_start", {
        roomId,
        players,
        currentPlayer: game.currentPlayer,
      });

      console.log(`Started game in ${roomId} with players:`, players);
    }
  });

  socket.on("send_message", ({ roomId, text }) => {
    const game = getGame(roomId);
    if (!game) return;

    // 🚫 Enforce turns
    if (socket.id !== game.currentPlayer) {
      socket.emit("error_message", "Not your turn");
      return;
    }

    const message = {
      id: Date.now().toString(),
      author: socket.id,
      text,
    };

    game.messages.push(message);

    // 🔄 Switch turn
    const nextPlayer = game.players.find((p) => p !== socket.id)!;
    game.currentPlayer = nextPlayer;
    game.turn++;

    io.to(roomId).emit("receive_message", {
      message,
      currentPlayer: game.currentPlayer,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    const index = waitingQueue.indexOf(socket.id);
    if (index !== -1) {
      waitingQueue.splice(index, 1);
    }
  });
}
