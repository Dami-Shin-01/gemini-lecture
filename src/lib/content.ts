import type { ComponentType } from "react";

// Static import map for all MDX content files
// @next/mdx processes these as React components at build time
const mdxModules: Record<string, () => Promise<{ default: ComponentType }>> = {
  // CH01: AI와 Gemini 소개
  "ch01/clip01": () => import("@content/ch01/clip01.mdx"),
  "ch01/clip02": () => import("@content/ch01/clip02.mdx"),
  "ch01/clip03": () => import("@content/ch01/clip03.mdx"),
  "ch01/clip04": () => import("@content/ch01/clip04.mdx"),
  // CH02: 프롬프트 엔지니어링
  "ch02/clip01": () => import("@content/ch02/clip01.mdx"),
  "ch02/clip02": () => import("@content/ch02/clip02.mdx"),
  "ch02/clip03": () => import("@content/ch02/clip03.mdx"),
  // CH03: 업무 문서 작성
  "ch03/clip01": () => import("@content/ch03/clip01.mdx"),
  "ch03/clip02": () => import("@content/ch03/clip02.mdx"),
  "ch03/clip03": () => import("@content/ch03/clip03.mdx"),
  // CH04: 데이터 분석 & 정리
  "ch04/clip01": () => import("@content/ch04/clip01.mdx"),
  "ch04/clip02": () => import("@content/ch04/clip02.mdx"),
  "ch04/clip03": () => import("@content/ch04/clip03.mdx"),
  // CH05: Deep Research
  "ch05/clip01": () => import("@content/ch05/clip01.mdx"),
  "ch05/clip02": () => import("@content/ch05/clip02.mdx"),
  "ch05/clip03": () => import("@content/ch05/clip03.mdx"),
  // CH06: Gems
  "ch06/clip01": () => import("@content/ch06/clip01.mdx"),
  "ch06/clip02": () => import("@content/ch06/clip02.mdx"),
  "ch06/clip03": () => import("@content/ch06/clip03.mdx"),
  // CH07: NotebookLM
  "ch07/clip01": () => import("@content/ch07/clip01.mdx"),
  "ch07/clip02": () => import("@content/ch07/clip02.mdx"),
  "ch07/clip03": () => import("@content/ch07/clip03.mdx"),
  // CH08: 실무 프로젝트
  "ch08/clip01": () => import("@content/ch08/clip01.mdx"),
  "ch08/clip02": () => import("@content/ch08/clip02.mdx"),
};

export async function getMdxComponent(
  chapter: string,
  clip: string
): Promise<ComponentType | null> {
  const key = `${chapter}/${clip}`;
  const loader = mdxModules[key];
  if (!loader) return null;
  try {
    const mod = await loader();
    return mod.default;
  } catch {
    return null;
  }
}
