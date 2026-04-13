"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

interface Message {
  id: string;
  author: string;
  original: string;
  rewritten?: string;
  aiRewritten?: boolean;
}

function RevealView({
  messages,
  takeoverTurn,
  myId,
  onShare,
  shareUrl,
}: {
  messages: Message[];
  takeoverTurn: number;
  myId: string;
  onShare: () => void;
  shareUrl: string;
}) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">🔍 What actually happened</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">🧠 Your reality</h3>
        </div>
        <div>
          <h3 className="font-semibold mb-2">👀 Opponent&apos;s reality</h3>
        </div>

        {messages.map((msg: Message, i: number) => {
          const isTakeover = i === takeoverTurn;
          const isAfter = i >= takeoverTurn;
          const isMe = msg.author === myId;

          return (
            <div key={msg.id} className="contents">
              <div
                className={`p-2 border rounded ${
                  isTakeover ? "bg-yellow-200 text-black" : ""
                }`}
              >
                {isTakeover && (
                  <div className="text-xs font-bold">⚡ TAKEOVER</div>
                )}
                {isMe ? msg.original : msg.rewritten || msg.original}
              </div>

              <div
                className={`p-2 border rounded ${
                  isAfter ? "bg-yellow-200 text-black" : ""
                }`}
              >
                {isMe ? msg.rewritten || msg.original : msg.original}
              </div>
            </div>
          );
        })}
      </div>

      <button className="mt-6 bg-black text-white px-4 py-2" onClick={onShare}>
        🔗 Share this game
      </button>
      <div className="text-xs mt-2 break-all">{shareUrl}</div>
    </div>
  );
}

export default function Home() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const [gameResult, setGameResult] = useState<{
    winner: string;
    reason: string;
    takeoverTurn: number;
    stoppedBy: string | null;
  } | null>(null);

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

    socket.on("game_result", ({ result, messages, players }) => {
      setGameResult(result);
      setMessages(messages);
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

  const stopGame = () => {
    if (!roomId) return;

    socket.emit("stop", { roomId });
  };

  const [shareUrl, setShareUrl] = useState<string>("");

  const handleShare = () => {
    if (!gameResult) return;

    const payload = {
      messages,
      takeoverTurn: gameResult.takeoverTurn,
    };

    const encoded = btoa(JSON.stringify(payload));

    const url = `${window.location.origin}/replay?data=${encoded}`;
    setShareUrl(url);

    navigator.clipboard.writeText(url);
    console.log(url);
  };

  const isGameOver = gameResult !== null;
  const isMyTurn = myId === currentPlayer && !isGameOver;

  if (gameResult && myId) {
    return (
      <RevealView
        messages={messages}
        takeoverTurn={gameResult.takeoverTurn}
        myId={myId}
        onShare={handleShare}
        shareUrl={shareUrl}
      />
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Turing Duel</h1>

      {gameResult && (
        <div className="mb-4 p-3 border rounded">
          <div className="font-bold">
            {gameResult.winner === myId
              ? "🎉 You win!"
              : gameResult.winner === "AI"
                ? "🤖 AI wins!"
                : "💀 You lose!"}
          </div>

          <div className="text-sm text-gray-600">
            Reason: {gameResult.reason}
          </div>

          <div className="text-xs text-gray-400">
            Takeover turn: {gameResult.takeoverTurn}
          </div>
        </div>
      )}

      {gameResult && (
        <div className="text-xs text-gray-500">
          {gameResult.stoppedBy === myId
            ? "You stopped the game"
            : "Opponent stopped the game"}
        </div>
      )}

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
              {msg.author === myId
                ? msg.original
                : msg.rewritten || msg.original}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          className="bg-red-600 text-white px-4 py-2"
          onClick={stopGame}
          disabled={isGameOver}
        >
          🛑 STOP: AI took over
        </button>
        <input
          className="border flex-1 p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
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
