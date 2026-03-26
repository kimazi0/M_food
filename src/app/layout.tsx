import type { Metadata } from "next";
import { Inter, Oswald, Irish_Grover, Italianno } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const irish = Irish_Grover({
  weight: "400",
  variable: "--font-irish",
  subsets: ["latin"],
});

const italiano = Italianno({
  weight: "400",
  variable: "--font-italiano",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mfood - Restaurant Ordering",
  description: "Modern progressive restaurant ordering platform",
};

import { ContactModal } from "@/components/ui/ContactModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${oswald.variable} ${irish.variable} ${italiano.variable} font-sans antialiased text-white bg-background selection:bg-primary/30`}>
        {children}
        <ContactModal />
      </body>
    </html>
  );
}
