import type { Metadata } from "next";
import FieldMaterialsPackClient from "./FieldMaterialsPackClient";

export const metadata: Metadata = {
  title: "실습 자료 팩 · JB의 하루",
  description:
    "ch02 듣기 실습을 시작하기 전 3분 안에 준비하는 자료 패키지 — NotebookLM 공유 노트북, 원본 소스 4종, Gem 인스트럭션 5종.",
};

export default function FieldMaterialsPackPage() {
  return <FieldMaterialsPackClient />;
}
