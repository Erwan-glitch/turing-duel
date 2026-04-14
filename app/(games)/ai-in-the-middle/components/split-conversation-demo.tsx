"use client";

import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";

export function SplitConversationDemo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const conversation = [
    {
      id: 1,
      player: "A",
      textA: "Hey! How's it going?",
      textB: "Hey! How's it going?",
      synced: true,
    },
    {
      id: 2,
      player: "B",
      textA: "Pretty good, just relaxing",
      textB: "Pretty good, just relaxing",
      synced: true,
    },
    {
      id: 3,
      player: "A",
      textA: "Nice! What are you up to?",
      textB: "Nice! What are you up to?",
      synced: true,
    },
    {
      id: 4,
      player: "B",
      textA:
        "I've been analyzing neural patterns in large language models. The implications are fascinating.",
      textB: "Just watching some shows lol",
      synced: false,
    },
    {
      id: 5,
      player: "A",
      textA:
        "Wow! That sounds very serious. Is this part of your job or just for fun?",
      textB:
        "Could you elaborate on the methodological approach to pattern recognition?",
      synced: false,
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
            className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6 relative"
          >
            <div className="absolute -top-3 left-6 bg-cyan-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Player A&apos;s View
            </div>
            <div className="space-y-4 mt-4 mb-20">
              {conversation.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                  className={`flex ${msg.player === "A" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      msg.player === "A"
                        ? "bg-cyan-600 text-white"
                        : msg.synced
                          ? "bg-slate-700 text-slate-200"
                          : "bg-purple-600/30 border border-purple-500/50 text-slate-200"
                    }`}
                  >
                    {msg.textA}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* STOP Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 1 }}
              className="absolute bottom-6 left-6 right-6"
            >
              <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-red-500/50 transition-all hover:scale-105">
                STOP — AI took over
              </button>
            </motion.div>
          </motion.div>

          {/* Player B view */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 relative"
          >
            <div className="absolute -top-3 left-6 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Player B&apos;s View
            </div>
            <div className="space-y-4 mt-4 mb-20">
              {conversation.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                  className={`flex ${msg.player === "B" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      msg.player === "B"
                        ? "bg-purple-600 text-white"
                        : msg.synced
                          ? "bg-slate-700 text-slate-200"
                          : "bg-cyan-600/30 border border-cyan-500/50 text-slate-200"
                    }`}
                  >
                    {msg.textB}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* STOP Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 1 }}
              className="absolute bottom-6 left-6 right-6"
            >
              <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-red-500/50 transition-all hover:scale-105">
                STOP — AI took over
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Explanation note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
              Notice the Divergence
            </h3>
            <p className="text-slate-400 leading-relaxed mb-4">
              After message 3, the AI takeover begins. Player A sees Player B
              talking about &quot;neural patterns&quot; while Player B was
              mentioning &quot;shows&quot; which makes him confused when Player
              A is asking about &quot;neural patterns.&quot; Neither player
              knows when this divergence started or if it even occured yet (was
              it just a joker?).
            </p>
            <div className="flex items-start gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-3 h-3 bg-slate-700 rounded"></div>
                <span>Original messages</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-3 h-3 bg-purple-600/30 border border-purple-500/50 rounded"></div>
                <span>AI-rewritten messages</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
