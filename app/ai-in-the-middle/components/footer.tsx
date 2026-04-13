"use client";

import { motion } from "motion/react";

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Turing Duel
            </h3>
            <p className="text-slate-500 text-sm">turing-duel.com</p>
          </div>

          {/* Tagline */}
          <div className="text-center">
            <p className="text-slate-400 italic text-sm">
              You think you&apos;re talking to a human. At some point...
              you&apos;re not.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-6 text-sm text-slate-500">
            <motion.a
              href="#"
              whileHover={{ color: "#06b6d4" }}
              className="hover:text-cyan-400 transition-colors"
            >
              About
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ color: "#06b6d4" }}
              className="hover:text-cyan-400 transition-colors"
            >
              Privacy
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ color: "#06b6d4" }}
              className="hover:text-cyan-400 transition-colors"
            >
              Contact
            </motion.a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-600 text-sm">
          <p>© 2026 Turing Duel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
