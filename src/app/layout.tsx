import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import TimelineNav from "@/components/layout/TimelineNav";
import RealtimeQuestion from "@/components/layout/RealtimeQuestion";
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
  title: "JB의 하루 — AI로 바뀌는 실무 7단계 | Gemini 활용 실습",
  description: "JB 담당자 김지연의 하루를 따라가며 Gemini AI 활용법을 배웁니다. 듣기, 말하기, 질문하기, 실행하기, 설득하기, 축적하기 — 08:30부터 17:00까지 실전 체험.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const curriculum = getCurriculum();

  return (
    <html lang="ko" className={`${lgEIText.variable} ${lgEIHeadline.variable}`}>
      <body className="min-h-screen antialiased" data-time="noon">
        <TimelineNav curriculum={curriculum} />
        <main id="main-content" className="min-h-[calc(100vh-72px)]">
          {children}
        </main>
        <RealtimeQuestion />
      </body>
    </html>
  );
}
