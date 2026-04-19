import type { Metadata } from "next";
import RetrospectiveClient from "./RetrospectiveClient";

export const metadata: Metadata = {
  title: "오늘의 회고 · JB의 하루",
  description: "하루 실습을 돌아보며 다음 주에 다시 해볼 1가지를 고릅니다.",
};

export default function RetrospectivePage() {
  return <RetrospectiveClient />;
}
