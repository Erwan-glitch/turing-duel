"use client";

import { useRouter } from "next/navigation";
import { CTASection } from "./components/cta-section";
import { Footer } from "./components/footer";
import { HeroSection } from "./components/hero-section";
import { Navbar } from "./components/navbar";
import { SplitConversationDemo } from "./components/split-conversation-demo";
import { useEffect, useState } from "react";
import { useSocket } from "@/app/providers/socket-provider";

export default function LandingPage() {
  const router = useRouter();
  const socket = useSocket();

  const [onlineCount, setOnlineCount] = useState(0);

  const onJoinQueue = () => {
    // Navigate to the queue page
    router.push("/ai-in-the-middle/queue");
  };

  useEffect(() => {
    socket.on("online_count", (count) => {
      setOnlineCount(count);
    });
    return () => {
      socket.off("online_count");
    };
  }, [socket]);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <HeroSection onJoinQueue={onJoinQueue} onlineCount={onlineCount} />
      <p>Chat with a stranger.</p>
      <p>At some point, AI rewrites your messages.</p>
      <p>You won&apos;t see the same conversation anymore.</p>
      <p className="text-cyan-400 font-medium">
        Detect when it happens before they do.
      </p>
      <SplitConversationDemo />
      <CTASection onJoinQueue={onJoinQueue} />
      <Footer />
    </div>
  );
}
