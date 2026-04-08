import { Server, Socket } from "socket.io";
import { addToQueue, getGame, removeFromQueue } from "../game/gameManager";

export function registerHandlers(io: Server, socket: Socket) {
  console.log("User connected:", socket.id);

  socket.on("find_match", () => {
    const result = addToQueue(socket.id);

    if (result) {
      const { roomId, game } = result;

      const players = game.data.players;

      players.forEach((p) => {
        const playerSocket = io.sockets.sockets.get(p);
        playerSocket?.join(roomId);
      });

      io.to(roomId).emit("game_start", {
        roomId,
        players,
        currentPlayer: game.data.currentPlayer,
      });

      console.log(`Game started in ${roomId} with players:`, players);
    }
  });

  socket.on("send_message", ({ roomId, text }) => {
    const game = getGame(roomId);
    if (!game) return;
    if (game.data.state !== "playing") return;

    // 🚫 Enforce turns
    if (socket.id !== game.data.currentPlayer) {
      socket.emit("error_message", "Not your turn");
      return;
    }

    const message = game.addMessage(socket.id, text);

    io.to(roomId).emit("receive_message", {
      message,
      currentPlayer: game.data.currentPlayer,
    });
  });

  socket.on("stop", ({ roomId }) => {
    const game = getGame(roomId);
    if (!game) return;

    game.stopGame();
    io.to(roomId).emit("game_stopped", game.data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    removeFromQueue(socket.id);
  });
}
