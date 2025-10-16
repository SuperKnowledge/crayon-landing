"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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
            <h2 className="text-2xl font-bold mb-4 text-white">Introduction</h2>
            <p className="mb-4">
              At Crayon AI, Inc. ("Crayon", "we", "us", or "our"), we respect your privacy and are committed to protecting it through our compliance with this policy.
            </p>
            <p>
              This policy describes the types of information we may collect from you or that you may provide when you use our mobile application, Crayon (the "App"), and our practices for collecting, using, maintaining, protecting, and disclosing that information.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">Information We Collect</h2>
            <p className="mb-4">
              We collect several types of information for various purposes to provide and improve our service to you:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Data:</strong> While using our App, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to, your email address and name.</li>
              <li><strong>Usage Data:</strong> We may also collect information that your device sends whenever you use our App ("Usage Data"). This Usage Data may include information such as your device's Internet Protocol address (e.g. IP address), device model, operating system, the pages of our App that you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data.</li>
              <li><strong>Device Data:</strong> We may collect information about your device, including the hardware model, operating system and version, unique device identifiers, and mobile network information.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">Use of Data</h2>
            <p className="mb-4">
              Crayon AI, Inc. uses the collected data for various purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To allow you to participate in interactive features of our service when you choose to do so</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our service</li>
              <li>To monitor the usage of our service</li>
              <li>To detect, prevent, and address technical issues</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">Data Sharing</h2>
            <p className="mb-4">
              We may share your personal information in the following situations:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>With Service Providers:</strong> We may share your personal information with third-party service providers to monitor and analyze the use of our service.</li>
              <li><strong>For Business Transfers:</strong> We may share or transfer your personal information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
              <li><strong>With Affiliates:</strong> We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Policy.</li>
              <li><strong>With Business Partners:</strong> We may share your information with our business partners to offer you certain products, services or promotions.</li>
              <li><strong>With Your Consent:</strong> We may disclose your personal information for any other purpose with your consent.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">Data Security</h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">Children's Privacy</h2>
            <p>
              Our service does not address anyone under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your Child has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">Contact Us</h2>
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
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="row-start-3 p-6 text-center"
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-xs text-white/40">
          <span>© 2025 Crayon AI, Inc.</span>
          <span className="hidden md:inline">•</span>
          <a 
            href="mailto:support@crayon-ai.com" 
            className="hover:text-white/60 transition-colors"
          >
            support@crayon-ai.com
          </a>
        </div>
      </motion.footer>
    </main>
  );
}