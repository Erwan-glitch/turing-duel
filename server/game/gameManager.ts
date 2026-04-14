import { GameId, GamesConstructor } from "../types/game";
import { AitmGame } from "../games/ai-in-the-middle";

const gamesClasses: Record<GameId, GamesConstructor[GameId]> = {
  "ai-in-the-middle": AitmGame,
};

const games = new Map<string, InstanceType<GamesConstructor[GameId]>>();

export function createGame(roomId: string, players: string[], gameId: GameId) {
  const GameClass = gamesClasses[gameId];
  const game = new GameClass(roomId, players, gameId);
  games.set(roomId, game);
  return game;
}

export function getGame(
  roomId: string,
): InstanceType<GamesConstructor[GameId]> | undefined {
  return games.get(roomId);
}

export function removeGame(roomId: string) {
  games.delete(roomId);
}
