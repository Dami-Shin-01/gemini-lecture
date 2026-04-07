import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import MobileSidebar from "@/components/layout/MobileSidebar";
import { getCurriculum } from "@/lib/navigation";

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard",
  weight: "100 900",
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
    <html lang="ko" className={`${pretendard.variable}`}>
      <body className="min-h-screen antialiased">
        <Sidebar curriculum={curriculum} />
        <MobileSidebar curriculum={curriculum} />
        <main className="lg:ml-[260px] min-h-screen bg-cream">
          {children}
        </main>
      </body>
    </html>
  );
}
