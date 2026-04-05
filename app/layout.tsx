import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "3am thought",
  description: "a place to leave the things you can't say anywhere else.",
  openGraph: {
    title: "3am thought",
    description: "a place to leave the things you can't say anywhere else.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
