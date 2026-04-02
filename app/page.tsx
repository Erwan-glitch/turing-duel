"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

interface Message {
  text: string;
  author: string;
}

export default function Home() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
  const [myId, setMyId] = useState<string | null>(null);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      setMyId(socket.id!);
      socket.emit("find_match");
    });

    socket.on("game_start", ({ roomId, currentPlayer }) => {
      setRoomId(roomId);
      setCurrentPlayer(currentPlayer);
    });

    socket.on("receive_message", ({ message, currentPlayer }) => {
      setMessages((prev) => [...prev, message]);
      setCurrentPlayer(currentPlayer);
    });

    socket.on("error_message", (msg) => {
      alert(msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!input) return;
    if (!roomId) return;

    socket.emit("send_message", { text: input, roomId });

    setInput("");
  };

  const isMyTurn = myId === currentPlayer;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Turing Duel</h1>

      <div className="mb-2">
        {isMyTurn ? "🟢 Your turn" : "🔴 Opponent's turn"}
      </div>

      <div className="border h-80 overflow-y-auto mb-4 p-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.author === myId ? "text-right" : "text-left"}
          >
            <span className="inline-block px-2 py-1 border rounded">
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="border flex-1 p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!isMyTurn}
        />
        <button
          className="bg-black text-white px-4"
          onClick={sendMessage}
          disabled={!isMyTurn}
        >
          Send
        </button>
      </div>
    </div>
  );
}
