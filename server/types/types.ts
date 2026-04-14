import { GameId } from "./game";

export type PlayerID = string;

export type Message = {
  id: string;
  author: PlayerID;
  original: string;
  rewritten: string;
  aiRewritten?: boolean;
};

export type GameState = "waiting" | "playing" | "finished";

export type GameData = {
  roomId: string;
  players: PlayerID[];
  gameId: GameId;
  turn: number;
  currentPlayer: PlayerID;
  takeoverTurn: number | null;
  state: GameState;
  messages: Message[];
};

export type GameResult = {
  winner: PlayerID | "AI";
  loser: PlayerID;
  reason: "too_early" | "correct" | "too_late";
  stoppedBy: PlayerID;
  takeoverTurn: number;
};
