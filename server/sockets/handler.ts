import { Server, Socket } from "socket.io";
import { addToQueue, getGame, removeFromQueue } from "../game/gameManager";
import { impersonateMessage } from "../bot/impersonate";

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

  socket.on("send_message", async ({ roomId, text }) => {
    const game = getGame(roomId);
    if (!game) return;
    if (game.data.state !== "playing") return;

    // 🚫 Enforce turns
    if (socket.id !== game.data.currentPlayer) {
      socket.emit("error_message", "Not your turn");
      return;
    }

    const receiverID = game.data.players.find((p) => p !== socket.id);
    if (!receiverID) {
      throw new Error("Receiver not found");
    }

    const senderSocket = io.sockets.sockets.get(socket.id);
    const receiverSocket = io.sockets.sockets.get(receiverID);

    game.switchTurn();

    // .emit("typing_indicator");
    senderSocket?.emit("receive_message", {
      message: {
        author: socket.id,
        original: text,
      },
      currentPlayer: game.data.currentPlayer,
    });

    let rewrittenText = text;

    if (game.isAITurn()) {
      rewrittenText = await impersonateMessage({
        incomingMessage: game.data.messages
          .filter((m) => m.author === receiverID)
          .slice(-1)[0].original,
        playerHistory: game.data.messages
          .filter((m) => m.author === socket.id)
          .map((m) => m.original),
      });
    }

    const message = game.addMessage(socket.id, text, rewrittenText);

    receiverSocket?.emit("receive_message", {
      message: {
        author: message.author,
        original: message.original,
        rewritten: message.rewritten,
      },
      currentPlayer: game.data.currentPlayer,
    });
  });

  socket.on("stop", ({ roomId }) => {
    const game = getGame(roomId);
    if (!game) return;
    if (game.data.state !== "playing") return;

    const playerId = socket.id;
    const result = game.evaluateStop(playerId);

    game.data.state = "finished";

    io.to(roomId).emit("game_result", {
      result,
      messages: game.data.messages,
      players: game.data.players,
    });

    console.log(`Game in ${roomId} finished. Result:`, result);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    removeFromQueue(socket.id);
  });
}
