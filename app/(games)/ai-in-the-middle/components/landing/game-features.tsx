import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Brain, Sparkles, Eye, Swords } from "lucide-react";

const features = [
  {
    icon: Swords,
    title: "Mind Games",
    description:
      "Act weird to bait false accusations. Or play it cool to avoid suspicion.",
    gradient: "from-red-500 to-orange-500",
  },
  {
    icon: Sparkles,
    title: "The Joker Card",
    description:
      "Once per game, request AI to write a message BEFORE takeover. Use it to trick your opponent into a false accusation.",
    gradient: "from-yellow-500 to-amber-500",
  },
  {
    icon: Eye,
    title: "Watch the Reveal",
    description:
      "After the game, see both timelines side-by-side. Discover the exact moment reality split.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Brain,
    title: "Pure Psychology",
    description:
      "No technical skills needed. Just intuition, deception, and the ability to spot when something feels... off.",
    gradient: "from-purple-500 to-pink-500",
  },
];

export function GameFeatures() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="features"
      ref={ref}
      className="py-32 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 relative overflow-hidden"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            The Magic of Deception
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Both players live in different conversations. Neither knows when
            divergence began. &quot;Are they acting weird... or am I?&quot;
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group relative"
            >
              <div
                className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-21 transition-opacity duration-500 rounded-2xl blur-lg -z-5"
                style={{
                  background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                  backgroundImage: `linear-gradient(135deg, ${
                    feature.gradient.includes("red")
                      ? "#ef4444, #f95e16"
                      : feature.gradient.includes("yellow")
                        ? "#eab308, #f59e0b"
                        : feature.gradient.includes("cyan")
                          ? "#06b6d4, #3b82f6"
                          : "#a855f7, #ec4899"
                  })`,
                }}
              />

              <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-slate-600 rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02]">
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <feature.icon className="size-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>

                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Highlight quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-30 text-center"
        >
          <p className="text-2xl text-slate-300 italic">
            &quot;Did AI take over... or are they just bluffing?&quot;
          </p>
        </motion.div>
      </div>
    </section>
  );
}
