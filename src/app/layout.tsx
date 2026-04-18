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
  description:
    "4시간 뒤, 간담회 기획안·피드백 메시지·인터뷰 질문지·경영진 보고서·팀 백서가 손에 남습니다. JB 담당자 김지연의 07:00~17:00 하루를 따라가며 Gemini로 실전 완주.",
  openGraph: {
    title: "JB의 하루 — Gemini 풀코스 실습",
    description:
      "4시간, 28개 실습으로 AI와 함께하는 하루를 완주합니다. 07:00 출근부터 17:00 퇴근까지.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "JB의 하루 — Gemini 풀코스 실습",
    description:
      "4시간 뒤, 5종의 산출물을 손에 쥐는 실전 교육. 07:00~17:00.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const curriculum = getCurriculum();

  return (
    <html lang="ko" className={`${lgEIText.variable} ${lgEIHeadline.variable}`}>
      <body className="min-h-screen antialiased" data-time="noon" data-ready="false">
        <TimelineNav curriculum={curriculum} />
        <main id="main-content" className="min-h-[calc(100vh-var(--nav-offset))]">
          {children}
        </main>
        <RealtimeQuestion />
      </body>
    </html>
  );
}
