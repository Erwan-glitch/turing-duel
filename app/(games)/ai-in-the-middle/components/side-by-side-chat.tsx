"use client";

import { Message } from "@/types/ai-in-the-middle";
import { ChatView } from "./chat-view";

export function SideBySideChat({
  messages,
  myId,
  takeoverTurn = undefined,
}: {
  messages: Message[];
  myId?: string;
  takeoverTurn?: number;
}) {
  // search messages to find opponent's id
  const opponentId = myId && messages.find((msg) => msg.author !== myId)?.author;

  return (
    <div className="flex gap-4 max-w-full max-h-full overflow-x-scroll">
      <div className="flex flex-col gap-4 basis-[50%]">
        <h2>{myId ? `🧠 Your reality` : `Player 1`}</h2>
        <ChatView
          messages={messages}
          myId={myId ?? 1}
          takeoverTurn={takeoverTurn}
        ></ChatView>
      </div>
      <div className="flex flex-col gap-4 basis-[50%]">
        <h2>{myId ? `👀 Opponent's reality` : `Player 2`}</h2>
        <ChatView
          messages={messages}
          myId={opponentId ?? 2}
          takeoverTurn={takeoverTurn}
        ></ChatView>
      </div>
    </div>
  );
}
