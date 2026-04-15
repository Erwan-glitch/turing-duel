"use client";

import { Message } from "@/types/ai-in-the-middle";

export function ChatView({
  messages,
  myId,
}: {
  messages: Message[];
  myId?: string;
}) {
  return (
    <div className="border h-80 overflow-y-auto p-2">
      {messages.map((msg, i) => {
        const isMe = msg.author === myId;

        let text = msg.original;

        text = isMe ? msg.original : msg.rewritten || msg.original;

        return (
          <div key={i} className={isMe ? "text-right" : "text-left"}>
            <span className="inline-block px-2 py-1 border rounded max-w-[80%] break-words">
              {text}
            </span>
          </div>
        );
      })}
    </div>
  );
}
