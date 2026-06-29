"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import WaitlistForm from "@/components/WaitlistForm";
import Footer from "@/components/Footer";

// Dynamically import 3D component to avoid SSR issues
const CrayonScene = dynamic(() => import("@/components/CrayonScene"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full max-w-[400px] mx-auto flex items-center justify-center">
      <div className="animate-pulse-glow text-[#171717]/20">Loading...</div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="landing-page relative grid min-h-[100svh] grid-rows-[auto,1fr,auto] overflow-hidden main-root">
      {/* Main content */}
      <div className="relative z-10 row-start-2 flex flex-col items-center justify-center px-6 py-10 md:py-12 gap-8 page-container">
        {/* Logo / wordmark + tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-4"
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-[1.15]">
            <span className="gradient-text inline-block pb-1">Crayon</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#2b2722] max-w-2xl mx-auto font-medium leading-snug">
            The infrastructure for software in the AI era
          </p>
        </motion.div>

        {/* 3D Crayon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-8"
        >
          <CrayonScene />
        </motion.div>

        {/* Waitlist form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="w-full max-w-md"
        >
          <p className="text-center text-[#68635b] mb-6 text-sm">
            Request TestFlight access to start building
          </p>
          <WaitlistForm />
        </motion.div>

        {/* Coming soon badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="px-4 py-2 bg-[#171717]/[0.04] rounded-full border border-[#171717]/10 max-w-full"
        >
          <span className="text-xs text-[#68635b] uppercase tracking-wider">
            Private Beta on TestFlight
          </span>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
