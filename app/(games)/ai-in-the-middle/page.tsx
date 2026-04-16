"use client";

import { useRouter } from "next/navigation";
import { CTASection } from "./components/landing/cta-section";
import { Footer } from "./components/landing/footer";
import { HeroSection } from "./components/landing/hero-section";
import { Navbar } from "./components/landing/navbar";
import { SplitConversationDemo } from "./components/landing/split-conversation-demo";
import { useEffect, useState } from "react";
import { useSocket } from "@/app/providers/socket-provider";
import { HowItWorks } from "./components/landing/how-it-works";
import { GameFeatures } from "./components/landing/game-features";

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
      <SplitConversationDemo />
      <HowItWorks />
      <GameFeatures />
      <CTASection onJoinQueue={onJoinQueue} />
      <Footer />
    </div>
  );
}
