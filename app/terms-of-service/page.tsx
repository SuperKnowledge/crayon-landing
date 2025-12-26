"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function TermsOfService() {
  return (
    <main className="relative grid min-h-[100svh] grid-rows-[auto,1fr,auto] overflow-hidden noise main-root">
      {/* Background gradient orbs - subtle and elegant (matching Privacy Policy) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[rgb(var(--color-accent-2))]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[rgb(var(--color-accent-1))]/10 rounded-full blur-3xl" />
      </div>
      
      {/* Main content */}
      <div className="relative z-10 row-start-2 flex flex-col items-center justify-center px-6 py-10 md:py-12 gap-8 page-container max-w-4xl mx-auto">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="self-start mb-4"
        >
          <Link 
            href="/" 
            className="text-white/60 hover:text-white/80 transition-colors flex items-center gap-2 text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Home
          </Link>
        </motion.div>
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text inline-block">Terms of Service</span>
          </h1>
          <p className="text-white/60 text-lg">
            Last updated: December 26, 2025
          </p>
        </motion.div>
        
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="w-full text-white/80 space-y-8 text-left"
        >
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">1. Introduction</h2>
            <p>
              Welcome to Crayon. These Terms of Service (&quot;Terms&quot;) govern your use of the website and mobile application provided by Crayon AI, Inc. (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By accessing or using our service, you agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">2. Eligibility</h2>
            <p>
              You must be at least 18 years old to use our service. By agreeing to these Terms, you represent and warrant that you are at least 18 years of age.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">3. App Creation and Ownership</h2>
            <p className="mb-4">
              <strong>How it works:</strong> You provide the ideas and creative input, and our platform (and AI) generates the code and functionality for the mini-apps (&quot;Apps&quot;).
            </p>
            <p className="mb-4">
              <strong>Ownership:</strong> Because Crayon generates the underlying code, Crayon AI, Inc. retains ownership of the code, platform, and infrastructure. However, we acknowledge your contribution of ideas and concepts.
            </p>
            <p>
              <strong>Remixing & Sharing:</strong> To foster a community of creativity, you agree that Crayon AI, Inc. has the right to feature, use, and allow other users to &quot;remix&quot; or build upon the Apps created from your ideas. You grant us a perpetual, worldwide, royalty-free license to use your generated Apps for these purposes.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">4. User Responsibilities</h2>
            <p>
              You are responsible for ensuring that the ideas and content you provide do not violate any laws or third-party rights (such as copyright or trademarks). You agree not to use Crayon to generate harmful, illegal, or offensive content.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">5. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Crayon AI, Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages. Our total liability to you for any claims arising out of or relating to these Terms or your use of the service is limited to the amount you have paid us in the past 12 months, if any.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">6. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">7. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the service after any such changes constitutes your acceptance of the new Terms.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">8. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <a href="mailto:support@crayon-ai.com" className="text-white hover:underline">
                support@crayon-ai.com
              </a>
            </p>
          </section>
        </motion.div>
      </div>
      
      {/* Footer */}
      <Footer />
    </main>
  );
}