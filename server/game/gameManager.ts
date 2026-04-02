import { Game, PlayerID } from "./types";

const games = new Map<string, Game>();

export function createGame(roomId: string, players: PlayerID[]): Game {
  const game: Game = {
    id: roomId,
    players,
    turn: 0,
    currentPlayer: players[Math.floor(Math.random() * 2)],
    messages: [],
  };

  games.set(roomId, game);
  return game;
}

export function getGame(roomId: string): Game | undefined {
  return games.get(roomId);
}