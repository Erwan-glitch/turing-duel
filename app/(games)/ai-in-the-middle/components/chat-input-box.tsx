import { Button } from "@/app/components/ui/button";
import { SendHorizonal, OctagonPause, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

export const ChatInputBox = ({
  input,
  setInput,
  sendMessage,
  stopGame,
  isGameOver,
  isMyTurn,
}: {
  input: string;
  setInput: (input: string) => void;
  sendMessage: () => void;
  stopGame: () => void;
  isGameOver: boolean;
  isMyTurn: boolean;
}) => {
  const inputLength = input.length;
  const maxLength = 200;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isMyTurn && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMyTurn]);

  return (
    <div className="flex flex-col bg-slate-600/50 rounded-xl">
      <input
        ref={inputRef}
        className="flex-1 p-2 m-1 rounded-lg break-words text-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        value={input}
        onChange={(e) => {
          if (e.target.value.length <= maxLength) {
            setInput(e.target.value);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
        disabled={!isMyTurn}
        placeholder="Say something..."
      />
      <div className="flex items-center gap-2">
        <Button
          className="bg-gradient-to-r from-red-500/70 to-orange-500/70 text-white m-2 shrink min-w-0"
          onClick={stopGame}
          disabled={isGameOver}
          size={"lg"}
        >
          <OctagonPause className="size-5" />
          <span className="truncate">AI took over</span>
        </Button>

        <div className="flex-1"></div>

        <div className="text-white/50 text-xs mx-2 font-mono">
          {inputLength}/{maxLength}
        </div>

        <Button
          className="bg-yellow-500/70 text-white"
          onClick={() => {}}
          disabled={true}
        >
          <Sparkles className="size-5" />
        </Button>

        <Button
          className="bg-green-500/70 text-white mr-2"
          onClick={sendMessage}
          disabled={!isMyTurn || isGameOver || inputLength === 0}
        >
          <SendHorizonal className="size-5" />
        </Button>
      </div>
    </div>
  );
};
