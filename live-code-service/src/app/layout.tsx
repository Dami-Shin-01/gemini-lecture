import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "라이브 참여 코드 발급",
  description: "라이브에 참여하신 회원님께 코드를 발급해 드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50 antialiased">{children}</body>
    </html>
  );
}
