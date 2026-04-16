import { Message } from "./ai-in-the-middle";
import { GameId } from "./game";

export interface ServerToClientEvents {
  online_count: (count: number) => void;
  error_message: (data: { message: string; kick: boolean }) => void;

  game_start: (data: {
    roomId: string;
    players: string[];
    currentPlayer: string;
    gameId: string;
  }) => void;

  game_state: (data: { messages: Message[]; currentPlayer: string }) => void;

  receive_message: (data: { message: Message; currentPlayer: string }) => void;

  game_result: (data: {
    result: {
      winner: string;
      reason: string;
      takeoverTurn: number;
      stoppedBy: string | null;
    };
    messages: Message[];
    players: string[];
  }) => void;
}

export interface ClientToServerEvents {
  find_match: (data: { gameId: GameId }) => void;
  join_room: (data: { roomId: string }) => void;
  send_message: (data: { roomId: string; text: string }) => void;
  stop: (data: { roomId: string }) => void;
}
