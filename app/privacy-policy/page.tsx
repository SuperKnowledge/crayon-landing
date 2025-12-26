"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <main className="relative grid min-h-[100svh] grid-rows-[auto,1fr,auto] overflow-hidden noise main-root">
      {/* Background gradient orbs - subtle and elegant */}
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
            <span className="gradient-text inline-block">Privacy Policy</span>
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
            <p className="mb-4">
              At Crayon AI, Inc. (&quot;Crayon&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), we respect your privacy and are committed to protecting it. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our mobile application (the &quot;App&quot;).
            </p>
            <p>
              By accessing or using our Service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-2 text-white/90">A. Information You Provide to Us</h3>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>
                <strong>Account Information:</strong> When you sign up or log in using third-party services (such as Google or Apple), we collect your name and email address associated with that account.
              </li>
              <li>
                <strong>User Content:</strong> We collect the text, images, photos, and other media that you upload or input into the App to generate your mini-apps.
              </li>
              <li>
                <strong>Waitlist Data:</strong> If you join our waitlist via the website, we collect your email address.
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 text-white/90">B. Information Collected Automatically</h3>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>
                <strong>Device Permissions:</strong> To enable specific features of the App, we may request access to your device&apos;s <strong>Camera</strong> and <strong>Photo Library</strong>. You can manage these permissions in your device settings at any time.
              </li>
              <li>
                <strong>Usage Data:</strong> We may collect information about how you access and use the Service, including your device type, operating system, browser type, User Agent, referrer URL, and interaction logs.
              </li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">3. How We Use Your Information</h2>
            <p className="mb-4">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide, operate, and maintain the App and Website.</li>
              <li>To create and host the mini-apps you generate based on your inputs.</li>
              <li>To manage your account and authentication via Google or Apple.</li>
              <li>To improve our services, analyze usage patterns, and fix technical issues.</li>
              <li>To communicate with you about updates, security alerts, and support.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">4. Data Sharing and Disclosure</h2>
            <p className="mb-4">
              We do not sell your personal data. We may share your information in the following situations:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Service Providers:</strong> We share data with trusted third-party vendors who assist us in operating our Service (e.g., Google for cloud infrastructure/Sheets, Vercel for hosting).
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.
              </li>
              <li>
                <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or asset sale, your Personal Data may be transferred.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">5. Your Privacy Rights</h2>
            <p className="mb-4">
              Depending on your location, including if you are a California resident, you may have the following rights:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Access:</strong> The right to request copies of your personal data.</li>
              <li><strong>Deletion:</strong> The right to request that we delete your personal data.</li>
              <li><strong>Correction:</strong> The right to request correction of inaccurate data.</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us at <a href="mailto:support@crayon-ai.com" className="text-white hover:underline">support@crayon-ai.com</a>.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">6. Data Retention & Security</h2>
            <p className="mb-4">
              We retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy.
            </p>
            <p>
              We implement reasonable security measures to protect your data. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">7. Children&apos;s Privacy</h2>
            <p>
              Our Service is intended for users aged 18 and older. We do not knowingly collect personally identifiable information from children under 13. If we become aware that we have collected Personal Data from a child under 13, we will take steps to remove that information from our servers.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
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