"use client";

import { useMemo } from "react";
import { SideBySideChat } from "../components/side-by-side-chat";

export default function ReplayPage() {
  const data = useMemo(() => {
    if (typeof window === "undefined") return null;

    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("data");

    if (!encoded) return null;

    try {
      return JSON.parse(atob(encoded));
    } catch (e) {
      console.error("Invalid replay data", e);
      return null;
    }
  }, []);

  if (!data) return <div className="p-4">Invalid or missing replay</div>;

  return (
    <div className="h-[100dvh] w-[100dvw] p-2 flex flex-col gap-4 bg-slate-900">
      <h1 className="text-xl font-bold">🎭 Replay</h1>
      <SideBySideChat
        messages={data.messages}
        takeoverTurn={data.takeoverTurn}
      ></SideBySideChat>
    </div>
  );
}
