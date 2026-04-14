import { GameId } from "../types/game";
import { GameData, PlayerID, Message, GameResult } from "../types/types";

export class AitmGame {
  data: GameData;

  constructor(roomId: string, players: PlayerID[], gameId: GameId) {
    this.data = {
      roomId,
      players,
      gameId,
      turn: 0,
      currentPlayer: players[Math.floor(Math.random() * players.length)],
      takeoverTurn: null,
      state: "playing",
      messages: [],
    };

    this.setTakeoverTurn();
  }

  addMessage(author: PlayerID, original: string, rewritten: string) {
    const message: Message = {
      id: Date.now().toString(),
      author,
      original,
      rewritten,
    };

    this.data.messages.push(message);

    return message;
  }

  switchTurn() {
    this.data.currentPlayer = this.data.players.find(
      (p) => p !== this.data.currentPlayer,
    )!;
    this.data.turn++;
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

  evaluateStop(playerId: PlayerID): GameResult {
    const turn = this.data.turn;
    const takeoverTurn = this.data.takeoverTurn;
    const opponentId = this.data.players.find((p) => p !== playerId);

    if (!opponentId) {
      throw new Error("Opponent not found");
    }

    if (takeoverTurn === null) {
      throw new Error("Takeover turn not set");
    }

    let result: GameResult;
    const isTooLate = turn > takeoverTurn + 3; // Allow a grace period of 3 turns after takeover

    if (turn < takeoverTurn) {
      result = {
        winner: opponentId,
        loser: playerId,
        reason: "too_early",
        stoppedBy: playerId,
        takeoverTurn,
      };
    } else if (isTooLate) {
      result = {
        winner: "AI",
        loser: playerId,
        reason: "too_late",
        stoppedBy: playerId,
        takeoverTurn,
      };
    } else {
      result = {
        winner: playerId,
        loser: opponentId,
        reason: "correct",
        stoppedBy: playerId,
        takeoverTurn,
      };
    }

    return result;
  }
}
