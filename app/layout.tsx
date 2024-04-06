import { TopHeader } from "@/components/Header";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AI } from "./action";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hack-Dash",
  description: "Hack-Dash is a dashboard built on top of Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AI>
          <div className="fixed inset-x-0 top-0 flex justify-center z-10">
            <div className="w-3/4">
              <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] blur-sm" />
              <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px" />
            </div>
            <div className="w-1/4">
              <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] blur-sm" />
              <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px" />
            </div>
          </div>
          <main className="flex h-full flex-col items-center justify-between p-8">
            <div className="flex flex-col w-full">
              <TopHeader />
            </div>
            {children}
            <Analytics />
          </main>
        </AI>
      </body>
    </html>
  );
}
