import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "reveal.js/reveal.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Crayon | The infrastructure for software in the AI era",
  description:
    "Crayon is a mini-app platform and ecosystem — the infrastructure for everything past coding: assembly, hosting, distribution, and monetization.",
  keywords:
    "mini-app platform, AI infrastructure, software infrastructure, developer platform, mini apps",
  authors: [{ name: "Crayon AI, Inc." }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Crayon | The infrastructure for software in the AI era",
    description:
      "A mini-app platform and ecosystem — the infrastructure for everything past coding.",
    type: "website",
    siteName: "Crayon",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
