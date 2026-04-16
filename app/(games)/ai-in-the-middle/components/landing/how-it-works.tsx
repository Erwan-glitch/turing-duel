import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Users, MessageCircle, Sparkles, Target, Trophy } from "lucide-react";

const steps = [
  {
    icon: Users,
    title: "Get Matched",
    description:
      "You are paired with another player. The chat begins normally.",
    color: "cyan",
  },
  {
    icon: MessageCircle,
    title: "Chat Naturally",
    description:
      "Exchange messages back and forth. Everything seems normal... for now.",
    color: "blue",
  },
  {
    icon: Sparkles,
    title: "AI Takes Over",
    description:
      "At an unknown moment, AI secretly starts rewriting your messages. You see your original text, but they see AI's version.",
    color: "purple",
  },
  {
    icon: Target,
    title: "Detect the Moment",
    description:
      'Hit "AI took over" at the right time. Too early? You lose. Too late? AI wins.',
    color: "pink",
  },
  {
    icon: Trophy,
    title: "Post-Game Reveal",
    description:
      "See the exact takeover moment and compare both conversation timelines side-by-side.",
    color: "emerald",
  },
];

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="py-32 bg-slate-950 relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-xl text-slate-400">
            A social deception game where reality diverges
          </p>
        </motion.div>

        <div className="space-y-16">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className={`flex flex-col md:flex-row items-center gap-8 ${
                idx % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Icon side */}
              <div className="flex-shrink-0">
                <div
                  className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${
                    step.color === "cyan"
                      ? "from-cyan-500 to-blue-500"
                      : step.color === "blue"
                        ? "from-blue-500 to-indigo-500"
                        : step.color === "purple"
                          ? "from-purple-500 to-pink-500"
                          : step.color === "pink"
                            ? "from-pink-500 to-rose-500"
                            : "from-emerald-500 to-teal-500"
                  } flex items-center justify-center shadow-lg shadow-${step.color}-500/50`}
                >
                  <step.icon className="size-12 text-white" />
                </div>
              </div>

              {/* Content side */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-3 mb-3">
                  <span className="text-slate-500 font-mono">0{idx + 1}</span>
                  <h3 className="text-3xl font-bold text-white">
                    {step.title}
                  </h3>
                </div>
                <p className="text-lg text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Divider line connecting steps */}
        <div className="absolute left-1/2 top-32 bottom-32 w-0.5 bg-gradient-to-b from-cyan-500 via-purple-500 to-emerald-500 opacity-20 hidden md:block" />
      </div>
    </section>
  );
}
