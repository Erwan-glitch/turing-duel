import { GameData, PlayerID, Message } from "./types";

export class Game {
  data: GameData;

  constructor(id: string, players: PlayerID[]) {
    this.data = {
      id,
      players,
      turn: 0,
      currentPlayer: players[Math.floor(Math.random() * players.length)],
      takeoverTurn: null,
      state: "playing",
      messages: [],
    };
  }

  addMessage(author: PlayerID, text: string) {
    const message: Message = {
      id: Date.now().toString(),
      author,
      text,
    };

    this.data.messages.push(message);
    this.data.turn++;
    this.switchTurn();

    return message;
  }

  switchTurn() {
    this.data.currentPlayer = this.data.players.find(
      (p) => p !== this.data.currentPlayer,
    )!;
  }

  setTakeoverTurn(minTurn = 3, maxTurn = 12) {
    const randomTurn =
      Math.floor(Math.random() * (maxTurn - minTurn + 1)) + minTurn;
    this.data.takeoverTurn = randomTurn;
  }

  isAITurn(): boolean {
    return (
      this.data.takeoverTurn !== null &&
      this.data.turn >= this.data.takeoverTurn
    );
  }

  stopGame() {
    this.data.state = "finished";
  }
}
