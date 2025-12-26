"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import MouseTrail from "@/components/MouseTrail";
import WaitlistForm from "@/components/WaitlistForm";
import Footer from "@/components/Footer";

// Dynamically import 3D component to avoid SSR issues
const CrayonScene = dynamic(() => import("@/components/CrayonScene"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full max-w-[400px] mx-auto flex items-center justify-center">
      <div className="animate-pulse-glow text-white/20">Loading...</div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="relative grid min-h-[100svh] grid-rows-[auto,1fr,auto] overflow-hidden noise main-root">
      {/* Mouse trail effect */}
      <MouseTrail />
      
      {/* Background gradient orbs - subtle and elegant */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[rgb(var(--color-accent-2))]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[rgb(var(--color-accent-1))]/10 rounded-full blur-3xl" />
      </div>
      
      {/* Main content */}
      <div className="relative z-10 row-start-2 flex flex-col items-center justify-center px-6 py-10 md:py-12 gap-8 page-container">
        {/* Logo/Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-7xl md:text-8xl lg:text-9xl font-bold mb-4">
            <span className="gradient-text inline-block">Crayon</span>
          </h1>
          
          {/* Tagline with typewriter effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-2"
          >
            <p className="text-xl md:text-2xl text-white/80 font-light">
              create your own apps
            </p>
            <p className="text-lg md:text-xl text-white/60 font-light">
              vibe only, no code
            </p>
          </motion.div>
        </motion.div>
        
        {/* 3D Crayon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-12"
        >
          <CrayonScene />
        </motion.div>
        
        {/* Waitlist form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="w-full max-w-md"
        >
          <p className="text-center text-white/60 mb-6 text-sm">
            Join the waitlist to be first to experience the magic
          </p>
          <WaitlistForm />
        </motion.div>
        
        {/* Coming soon badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 max-w-full"
        >
          <span className="text-xs text-white/60 uppercase tracking-wider">
            Coming Soon
          </span>
        </motion.div>
      </div>
      
      {/* Footer */}
      <Footer />
    </main>
  );
}