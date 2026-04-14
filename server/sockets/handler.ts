import { Server, Socket } from "socket.io";
import { createGame, getGame } from "../game/gameManager";
import { addToQueue, removeFromQueue } from "../game/queueManager";
import { impersonateMessage } from "../bot/impersonate";

let onlineCount = 0;
const activeRooms = new Map<string, string>(); // socketId -> roomId

export function registerHandlers(io: Server, socket: Socket) {
  onlineCount++;
  console.log("User connected:", socket.id, "Online count:", onlineCount);
  io.emit("online_count", onlineCount);

  socket.on("find_match", ({ gameId }) => {
    if (activeRooms.has(socket.id)) return; // Player is already in a game

    const result = addToQueue(socket.id, gameId);

    if (result) {
      const { roomId, players } = result;

      players.forEach((p) => {
        const playerSocket = io.sockets.sockets.get(p);

        if (!playerSocket) return;
        if (activeRooms.has(p)) return; // Player is already in a game

        activeRooms.set(p, roomId);

        playerSocket?.join(roomId);
      });

      const game = createGame(roomId, players, gameId);

      io.to(roomId).emit("game_start", {
        roomId,
        players,
        currentPlayer: game.data.currentPlayer,
        gameId,
      });

      console.log(`Game started in ${roomId} with players:`, players);
    }
  });

  socket.on("join_room", ({ roomId }) => {
    const playerId = socket.id;
    console.log(`Player ${playerId} joining room ${roomId}`);
    const game = getGame(roomId);

    if (!game) {
      socket.emit("error_message", "Game not found");
      return;
    }

    if (!game.data.players.includes(playerId)) {
      socket.emit("error_message", "You are not a player in this game");
      return;
    }

    socket.join(roomId);

    socket.emit("game_state", {
      messages: game.data.messages,
      currentPlayer: game.data.currentPlayer,
    });
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
    if (!receiverID) return;

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

    const lastIncomingMessage = game.data.messages
      .filter((m) => m.author === receiverID)
      .slice(-1)[0];

    try {
      if (game.isAITurn()) {
        rewrittenText = await impersonateMessage({
          incomingMessage: lastIncomingMessage.original,
          playerHistory: game.data.messages
            .filter((m) => m.author === socket.id)
            .map((m) => m.original),
        });
      }
    } catch (error) {
      console.error("Error in impersonateMessage:", error);
      rewrittenText = text; // Fallback to original text on error
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

    for (const p of game.data.players) {
      activeRooms.delete(p);
    }

    console.log(`Game in ${roomId} finished. Result:`, result);
  });

  socket.on("disconnect", () => {
    onlineCount--;
    console.log("User disconnected:", socket.id, "Online count:", onlineCount);
    removeFromQueue(socket.id);
    activeRooms.delete(socket.id);

    io.emit("online_count", onlineCount);
  });
}
