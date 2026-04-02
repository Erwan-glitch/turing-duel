export type PlayerID = string;

export type Message = {
  id: string;
  author: PlayerID;
  text: string;
};

export type Game = {
  id: string;
  players: PlayerID[];

  turn: number;
  currentPlayer: PlayerID;

  messages: Message[];
};