"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setStatus("loading");
    
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus("success");
        setMessage("You're on the list! We'll be in touch soon.");
        setEmail("");
        
        // Reset after 5 seconds
        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 5000);
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
        
        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 3000);
      }
    } catch (error: unknown) {
      console.error("Waitlist form error:", error);
      setStatus("error");
      setMessage("Network error. Please try again.");
      
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 3000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto waitlist-form">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={status === "loading" || status === "success"}
            className="w-full px-6 py-4 bg-white border border-[#d7d3ca] rounded-full
                     text-[#171717] placeholder-[#a8a39a] transition-all duration-300
                     focus:outline-none focus:border-[#f7751d]
                     focus:shadow-lg focus:shadow-[#f7751d]/20
                     disabled:opacity-50 disabled:cursor-not-allowed
                     waitlist-input"
            required
          />

          <button
            type="submit"
            disabled={status === "loading" || status === "success" || !email}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-5
                     bg-gradient-to-r from-[#e8402a] to-[#f7751d]
                     text-white font-medium rounded-full transition-all duration-300
                     hover:shadow-lg hover:shadow-[#f7751d]/30
                     hover:scale-105 active:scale-95 z-10
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 submit-btn"
          >
            {status === "loading" ? (
              <span className="inline-block animate-pulse">...</span>
            ) : status === "success" ? (
              "✓"
            ) : (
              "Join"
            )}
          </button>
        </div>
      </form>
      
      {/* Status message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-3 text-center text-sm ${
              status === "success"
                ? "text-[#16a34a]"
                : status === "error"
                ? "text-[#b91c1c]"
                : "text-[#68635b]"
            }`}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}