"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "@/app/providers/socket-provider";
import { Message } from "@/types/ai-in-the-middle";
import { ChatView } from "../../components/chat-view";
import { SideBySideChat } from "../../components/side-by-side-chat";
import { ChatInputBox } from "../../components/chat-input-box";
import { Button } from "@/app/components/ui/button";
import { ClipboardCopy, HandCoins, Home, Play } from "lucide-react";

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
  const router = useRouter();

  return (
    <div className="py-2 flex flex-col gap-4">
      <h2 className="text-lg font-bold mb-4">🔍 What actually happened</h2>

      <SideBySideChat
        messages={messages}
        takeoverTurn={takeoverTurn}
        myId={myId}
      ></SideBySideChat>

      <div className="border text-slate-700/50"></div>

      <div className="flex flex-col md:flex-row gap-4">
        <Button
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-12 py-6 text-lg rounded-full shadow-lg shadow-cyan-500/50 transition-all hover:shadow-xl hover:brightness-110 hover:scale-105 group"
          onClick={onShare}
        >
          <ClipboardCopy className="size-5"></ClipboardCopy>
          Share this game
        </Button>

        <Button
          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-12 py-6 text-lg rounded-full shadow-lg shadow-purple-500/50 transition-all hover:shadow-xl hover:brightness-110 hover:scale-105 group"
          onClick={() => {
            router.push("/ai-in-the-middle/queue");
          }}
        >
          <Play className="size-5"></Play>
          Play Again
        </Button>

        <Button
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-12 py-6 text-lg rounded-full shadow-lg shadow-green-500/50 transition-all hover:shadow-xl hover:brightness-110 hover:scale-105 group"
          onClick={() => {
            router.push("/donate");
          }}
        >
          <HandCoins className="size-5"></HandCoins>
          Donate
        </Button>

        <Button
          className="bg-gradient-to-r from-orange-500 to-lime-600 hover:from-orange-600 hover:to-lime-700 text-white px-12 py-6 text-lg rounded-full shadow-lg shadow-orange-500/50 transition-all hover:shadow-xl hover:brightness-110 hover:scale-105 group"
          onClick={() => {
            router.push("/");
          }}
        >
          <Home className="size-5"></Home>
          Homepage
        </Button>
      </div>

      <div className="text-xs mt-2 break-all">{shareUrl}</div>
    </div>
  );
}

export default function GamePage() {
  const router = useRouter();
  const params = useParams();
  const roomId = Array.isArray(params.roomId)
    ? params.roomId[0]
    : params.roomId;
  const socket = useSocket();
  const joinedRef = useRef(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>(""); //TODO: enforce max length
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
  const [myId, setMyId] = useState<string | undefined>(undefined);
  const [gameResult, setGameResult] = useState<{
    winner: string;
    reason: string;
    takeoverTurn: number;
    stoppedBy: string | null;
  } | null>(null);

  useEffect(() => {
    const setId = () => {
      setMyId(socket.id!);
    };

    socket.on("connect", setId);

    if (socket.connected) {
      setId();
    }

    return () => {
      socket.off("connect", setId);
    };
  }, [socket]);

  useEffect(() => {
    if (!roomId) return;
    if (!socket.connected) return;

    if (!joinedRef.current) {
      joinedRef.current = true;
      socket.emit("join_room", { roomId });
    }

    const onGameState = ({
      messages,
      currentPlayer,
    }: {
      messages: Message[];
      currentPlayer: string;
    }) => {
      setMessages(messages);
      setCurrentPlayer(currentPlayer);
    };

    socket.on("game_state", onGameState);

    const onMessage = ({
      message,
      currentPlayer,
    }: {
      message: Message;
      currentPlayer: string;
    }) => {
      setMessages((prev) => [...prev, message]);
      setCurrentPlayer(currentPlayer);
    };

    socket.on("receive_message", onMessage);

    const onGameResult = ({
      result,
      messages,
      players,
    }: {
      result: {
        winner: string;
        reason: string;
        takeoverTurn: number;
        stoppedBy: string | null;
      };
      messages: Message[];
      players: string[];
    }) => {
      setGameResult(result);
      setMessages(messages);
    };

    socket.on("game_result", onGameResult);

    const onErrorMessage = (data: { message: string; kick: boolean }) => {
      alert(data.message);
      if (data.kick) {
        router.push("/ai-in-the-middle/");
      }
    };

    socket.on("error_message", onErrorMessage);

    socket.on("disconnect", () => {
      alert("Disconnected from server");
      router.push("/ai-in-the-middle/");
    });

    return () => {
      socket.off("game_state", onGameState);
      socket.off("receive_message", onMessage);
      socket.off("game_result", onGameResult);
      socket.off("error_message", onErrorMessage);
    };
  }, [roomId, socket, router]);

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

    const url = `${window.location.origin}/ai-in-the-middle/replay?data=${encoded}`;
    setShareUrl(url);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    } else {
      console.log("Clipboard not supported");
    }
    console.log(url);
  };

  const isGameOver = gameResult !== null;
  const isMyTurn = myId === currentPlayer && !isGameOver;

  return (
    <div className="flex flex-col gap-4 p-4 mx-auto w-[100dvw] h-[100dvh] bg-slate-900">
      <h1 className="text-xl font-bold mb-4">AI In The Middle</h1>

      {gameResult && (
        <>
          <div
            className={`p-3 border rounded ${gameResult.winner === myId ? "bg-green-700" : gameResult.winner === "AI" ? "bg-slate-600" : "bg-red-800"}`}
          >
            <div className="font-bold">
              {gameResult.winner === myId
                ? "🎉 You win!"
                : gameResult.winner === "AI"
                  ? "🤖 AI wins!"
                  : "💀 You lose!"}
            </div>

            <div className="text-sm text-slate-300">
              Reason: {gameResult.reason}
            </div>

            <div className="text-xs text-slate-400">
              Takeover turn: {gameResult.takeoverTurn}
            </div>
          </div>

          <div className="text-xs text-slate-400">
            {gameResult.stoppedBy === myId
              ? "You stopped the game"
              : "Opponent stopped the game"}
          </div>
        </>
      )}

      {gameResult && myId && (
        <RevealView
          messages={messages}
          takeoverTurn={gameResult.takeoverTurn}
          myId={myId}
          onShare={handleShare}
          shareUrl={shareUrl}
        />
      )}

      {!gameResult && (
        <>
          <ChatView messages={messages} myId={myId}></ChatView>

          <div className="mb-2">
            {isMyTurn ? "🟢 Your turn" : "🔴 Opponent's turn"}
          </div>

          <ChatInputBox
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
            stopGame={stopGame}
            isGameOver={isGameOver}
            isMyTurn={isMyTurn}
            isStopDisabled={messages.length === 0} // can't stop before any message is sent
          ></ChatInputBox>
        </>
      )}
    </div>
  );
}
