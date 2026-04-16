import { GameId } from "../../types/game";
import { customAlphabet } from "nanoid";

const queues: Record<GameId, string[]> = {
  "ai-in-the-middle": [],
};

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  6,
);

export function addToQueue(socketId: string, gameId: GameId) {
  const queue = queues[gameId];

  if (queue.includes(socketId)) {
    return null; // Already in queue
  }

  queue.push(socketId);
  console.log(
    `Adding ${socketId} to queue for ${gameId}. Current queue:`,
    queue,
  );

  if (queue.length < 2) return null;

  const player1 = queue.shift();
  const player2 = queue.shift();

  if (!player1 || !player2) {
    throw new Error("Not enough players to start a game");
  }

  const roomId = nanoid();
  console.log("Queue after match:", queues[gameId]);

  return {
    roomId,
    players: [player1, player2],
    gameId,
  };
}

export function removeFromQueue(socketId: string) {
  Object.values(queues).forEach((queue) => {
    const index = queue.indexOf(socketId);

    if (index === -1) return;

    queue.splice(index, 1);
    console.log(`Removed ${socketId} from queue. Current queue:`, queue);
  });
}

export function getQueueSize(gameId: GameId) {
  return queues[gameId].length;
}
