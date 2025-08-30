import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

// Primary font - clean and modern
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

// Display font - has more character, great for headings
const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Crayon - Create Your Own Apps",
  description: "Vibe only, no code. Build mini apps for yourself and people you care about.",
  keywords: "no-code, app builder, creative, social apps, mini apps",
  authors: [{ name: "Crayon AI, Inc." }],
  openGraph: {
    title: "Crayon - Create Your Own Apps",
    description: "Vibe only, no code.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}