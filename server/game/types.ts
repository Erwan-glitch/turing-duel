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
  id: string;
  players: PlayerID[];
  turn: number;
  currentPlayer: PlayerID;
  takeoverTurn: number | null;
  state: GameState;
  messages: Message[];
};