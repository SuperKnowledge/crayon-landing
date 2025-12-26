"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer({ className = "row-start-3" }: { className?: string }) {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className={`${className} p-6 text-center z-10`}
    >
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-xs text-white/40">
        <span>© {new Date().getFullYear()} Crayon AI, Inc.</span>
        <span className="hidden md:inline">•</span>
        <a 
          href="mailto:support@crayon-ai.com" 
          className="hover:text-white/60 transition-colors"
        >
          support@crayon-ai.com
        </a>
        <span className="hidden md:inline">•</span>
        <Link 
          href="/privacy-policy" 
          className="hover:text-white/60 transition-colors"
        >
          Privacy Policy
        </Link>
        <span className="hidden md:inline">•</span>
        <Link 
          href="/terms-of-service" 
          className="hover:text-white/60 transition-colors"
        >
          Terms of Service
        </Link>
      </div>
    </motion.footer>
  );
}