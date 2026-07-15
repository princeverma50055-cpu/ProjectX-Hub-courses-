import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "PROJECTX COURSES | Learn. Build. Get Certified.",
  description:
    "1000+ premium text-based courses in AI, Web Dev, Python, and more — by ProjectX Hub.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-brand-900 text-slate-200 antialiased`}>
        {children}
      </body>
    </html>
  );
}
