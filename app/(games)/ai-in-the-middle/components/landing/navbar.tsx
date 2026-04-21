"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HandCoins } from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = () => {
    if (window.location.pathname !== "/") {
      router.push("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: isScrolled ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors"
        >
          <Image
            src="/icons/icon-192.png"
            alt="Turing Duel Logo"
            width={48}
            height={48}
            className="rounded-lg"
          />
          <span className="font-bold">Turing Duel</span>
        </button>

        <div className="flex items-center gap-6">
          {/* <a
            href="#how-it-works"
            className="text-slate-400 hover:text-white transition-colors text-sm"
          >
            How It Works
          </a>
          <a
            href="#features"
            className="text-slate-400 hover:text-white transition-colors text-sm"
          >
            Features
          </a> */}
          <button
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/donate")}
          >
            <HandCoins className="size-5 inline-block" />
            Donate
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
