"use client";

import { useMemo } from "react";

interface Message {
  id: string;
  author: string;
  original: string;
  rewritten?: string;
  aiRewritten?: boolean;
}

export default function ReplayPage() {
  const data = useMemo(() => {
    if (typeof window === "undefined") return null;

    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("data");

    if (!encoded) return null;

    try {
      return JSON.parse(atob(encoded));
    } catch (e) {
      console.error("Invalid replay data");
      return null;
    }
  }, []);

  if (!data) return <div className="p-4">Invalid or missing replay</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">🎭 Replay</h1>

      {data.messages.map((msg: Message, i: number) => {
        const isTakeover = i === data.takeoverTurn;

        return (
          <div
            key={msg.id}
            className={`p-2 border mb-2 ${isTakeover ? "bg-yellow-200" : ""}`}
          >
            {isTakeover && (
              <div className="text-xs font-bold">⚡ AI TOOK OVER HERE</div>
            )}
            <div>{msg.original}</div>
          </div>
        );
      })}
    </div>
  );
}
