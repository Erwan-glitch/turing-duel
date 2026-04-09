import { Game } from "./game";

const games = new Map<string, Game>();
const waitingQueue: string[] = []; // socket ids waiting
let roomCounter = 1;

export function addToQueue(socketId: string) {
  waitingQueue.push(socketId);

  if (waitingQueue.length >= 2) {
    const player1 = waitingQueue.shift();
    const player2 = waitingQueue.shift();

    if (!player1 || !player2) {
      throw new Error("Not enough players to start a game");
    }

    const roomId = `room-${roomCounter++}`;
    const game = new Game(roomId, [player1, player2]);

    // Set AI takeover for this game
    game.setTakeoverTurn();

    games.set(roomId, game);
    return { roomId, game };
  }

  return null;
}

export function removeFromQueue(socketId: string) {
  const index = waitingQueue.indexOf(socketId);
  if (index !== -1) {
    waitingQueue.splice(index, 1);
  }
}

export function getGame(roomId: string): Game | undefined {
  return games.get(roomId);
}

export function removeGame(roomId: string) {
  games.delete(roomId);
}
