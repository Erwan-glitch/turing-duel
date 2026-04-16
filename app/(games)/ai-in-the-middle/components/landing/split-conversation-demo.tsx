"use client";

import { Message } from "@/types/ai-in-the-middle";
import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { ChatView } from "../chat-view";

export function SplitConversationDemo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const conversation: Message[] = [
    {
      id: "1",
      author: "A",
      original: "Hey! How's it going?",
    },
    {
      id: "2",
      author: "B",
      original: "Pretty good, just relaxing",
    },
    {
      id: "3",
      author: "A",
      original: "Nice! What are you up to?",
    },
    {
      id: "4",
      author: "B",
      original:
        "I've been analyzing neural patterns in large language models. The implications are fascinating.",
      rewritten: "Just chillin, maybe watchin somethin later.",
    },
    {
      id: "5",
      author: "A",
      original: "What are you going to watch?",
      rewritten:
        "Whoa, no way! That sounds super cool, kinda like sci-fi stuff. How do you even start with that?",
    },
  ];

  return (
    <section ref={ref} className="py-32 bg-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(6,182,212,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(168,85,247,0.1),transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            Two Players. Two Realities.
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            After AI takes over, you each see a different version of the same
            conversation. Neither of you knows when the divergence began.
          </p>
        </motion.div>

        {/* Split screen conversation */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Player A view */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-slate-800 py-4 backdrop-blur-sm border border-cyan-500/20 rounded-2xl relative"
          >
            <div className="absolute -top-3 left-6 bg-cyan-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Player A&apos;s View
            </div>
            <ChatView
              messages={conversation}
              myId={"A"}
              takeoverTurn={4}
            ></ChatView>
          </motion.div>

          {/* Player B view */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-slate-800 py-4 backdrop-blur-sm border border-purple-500/20 rounded-2xl relative"
          >
            <div className="absolute -top-3 left-6 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Player B&apos;s View
            </div>
            <ChatView
              messages={conversation}
              myId={"B"}
              takeoverTurn={4}
            ></ChatView>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
