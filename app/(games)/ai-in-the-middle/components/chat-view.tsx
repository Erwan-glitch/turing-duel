"use client";

import { Message } from "@/types/ai-in-the-middle";
import { motion } from "motion/react";
import React, { useEffect, useRef } from "react";

export function ChatView({
  messages,
  myId,
  takeoverTurn = undefined,
}: {
  messages: Message[];
  myId?: string | 1 | 2;
  takeoverTurn?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  // if (!messages.length) return null;

  return (
    <div
      ref={containerRef}
      className="bg-slate-800 rounded-xl h-full min-w-xs overflow-y-auto p-2 flex flex-col justify-end"
    >
      {messages.map((msg, i) => {
        const isMe =
          msg.author === myId ||
          (typeof myId === "number" && i % 2 === myId - 1); // spectator view

        let text = msg.original;

        text = isMe ? msg.original : msg.rewritten || msg.original;

        const isTakeover = takeoverTurn !== undefined && takeoverTurn <= i + 1;

        return (
          <React.Fragment key={i}>
            {takeoverTurn === i + 1 && (
              <div className="my-3 border border-red-400"></div>
            )}
            <div className={isMe ? "text-right" : "text-left"}>
              <motion.div
                initial={{ opacity: 0, x: isMe ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={`inline-block px-2 py-1 my-1 rounded-lg max-w-[80%] break-words ${isMe ? "bg-blue-500/50 rounded-br-xs" : isTakeover ? "bg-red-500/50 rounded-bl-xs" : "bg-slate-500/50 rounded-bl-xs"}`}
              >
                {text}
              </motion.div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
