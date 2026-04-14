import { AitmGame } from "../games/ai-in-the-middle";

export type GameId = "ai-in-the-middle";

export type GamesConstructor = {
  "ai-in-the-middle": typeof AitmGame;
};