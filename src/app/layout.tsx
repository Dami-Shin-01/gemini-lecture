import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import MobileSidebar from "@/components/layout/MobileSidebar";
import { getCurriculum } from "@/lib/navigation";

const lgEIText = localFont({
  src: [
    { path: "../fonts/LGEIText-Light.otf", weight: "300", style: "normal" },
    { path: "../fonts/LGEIText-Regular.otf", weight: "400", style: "normal" },
    { path: "../fonts/LGEIText-SemiBold.otf", weight: "600", style: "normal" },
    { path: "../fonts/LGEIText-Bold.otf", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-lg-text",
});

const lgEIHeadline = localFont({
  src: [
    { path: "../fonts/LGEIHeadline-Regular.otf", weight: "400", style: "normal" },
    { path: "../fonts/LGEIHeadline-Semibold.otf", weight: "600", style: "normal" },
    { path: "../fonts/LGEIHeadline-Bold.otf", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-lg-headline",
});

export const metadata: Metadata = {
  title: "Gemini Pro 기초 실무",
  description: "AI를 업무의 파트너로 만드는 실전 가이드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const curriculum = getCurriculum();

  return (
    <html lang="ko" className={`${lgEIText.variable} ${lgEIHeadline.variable}`}>
      <body className="min-h-screen antialiased">
        <Sidebar curriculum={curriculum} />
        <MobileSidebar curriculum={curriculum} />
        {/* lg:ml-[64px] matches collapsed sidebar width */}
        <main className="lg:ml-[64px] min-h-screen bg-cream transition-all duration-300">
          {children}
        </main>
      </body>
    </html>
  );
}
