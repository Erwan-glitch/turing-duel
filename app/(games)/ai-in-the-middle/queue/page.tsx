"use client";

import { useSocket } from "@/app/providers/socket-provider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlayersCounter from "../components/landing/players-counter";

export default function QueuePage() {
  const socket = useSocket();

  const [onlineCount, setOnlineCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (socket.connected) {
      socket.emit("find_match", { gameId: "ai-in-the-middle" });
    }

    socket.on("connect", () => {
      socket.emit("find_match", { gameId: "ai-in-the-middle" });
    });

    const onGameStart = ({
      roomId,
      currentPlayer,
    }: {
      roomId: string;
      currentPlayer: string;
    }) => {
      router.push(`/ai-in-the-middle/game/${roomId}`);
    };

    socket.on("game_start", onGameStart);

    socket.on("online_count", (count) => {
      setOnlineCount(count);
    });

    socket.on("error_message", (msg) => {
      alert(msg);
    });

    return () => {
      socket.off("game_start", onGameStart);
      socket.off("online_count");
      socket.off("error_message");
    };
  }, [router, socket]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">⏳ Waiting for opponent...</h1>
      <p className="text-gray-400">
        The AI is preparing your opponent. Please wait.
      </p>

      <PlayersCounter onlineCount={onlineCount} />
    </div>
  );
}
