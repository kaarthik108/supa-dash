import { TopHeader } from "@/components/Header";
import { IconGitHub } from "@/components/ui/icons";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Suspense } from "react";
import { AI } from "./action";
import "./globals.css";

const robo = Roboto({
  weight: ["100", "400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hack-Dash",
  description: "Hack-Dash is a dashboard built on top of Next.js and Supabase",
  metadataBase: new URL("https://supa-dash.vercel.app"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Hack-Dash",
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${robo.className} flex flex-col min-h-screen`}>
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
          <main className="flex-grow py-8 px-1 bg-[#f0eee6]">
            <div>
              <TopHeader />
            </div>
            <Suspense
              fallback={
                <div className="flex items-center justify-center text-gray-600 text-sm mt-4 h-screen">
                  Loading....
                </div>
              }
            >
              {" "}
              {children}
            </Suspense>
            <Analytics />
          </main>
          <footer className="py-4 bg-[#f0eee6]">
            <div className="container mx-auto text-center">
              <p className="text-sm text-gray-600">
                Built with{" "}
                <a
                  href="https://nextjs.org"
                  className="text-black hover:underline"
                  target="_blank"
                >
                  Next.js
                </a>{" "}
                and{" "}
                <a
                  href="https://supabase.io"
                  className="text-black hover:underline mr-1"
                  target="_blank"
                >
                  Supabase
                </a>{" "}
                -{" "}
                <a
                  href="https://github.com/kaarthik108/subs-dash"
                  className="text-black hover:underline"
                  target="_blank"
                >
                  <IconGitHub className="inline-block h-3 w-3 ml-1" />
                </a>
              </p>
            </div>
          </footer>
        </AI>
      </body>
    </html>
  );
}
