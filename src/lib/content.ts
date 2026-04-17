import type { ComponentType } from "react";

// Static import map for all MDX content files
// @next/mdx processes these as React components at build time
const mdxModules: Record<string, () => Promise<{ default: ComponentType }>> = {
  // CH01: 사전 준비 — 하루 시작 (08:30)
  "ch01/clip01": () => import("@content/ch01/clip01.mdx"),
  "ch01/clip02": () => import("@content/ch01/clip02.mdx"),
  "ch01/clip03": () => import("@content/ch01/clip03.mdx"),
  // CH02: 듣기 — 목소리를 수집하다 (09:00)
  "ch02/clip01": () => import("@content/ch02/clip01.mdx"),
  "ch02/clip02": () => import("@content/ch02/clip02.mdx"),
  "ch02/clip03": () => import("@content/ch02/clip03.mdx"),
  // CH03: 말하기 — 관계를 지키며 전달하다 (10:00)
  "ch03/clip01": () => import("@content/ch03/clip01.mdx"),
  "ch03/clip02": () => import("@content/ch03/clip02.mdx"),
  "ch03/clip03": () => import("@content/ch03/clip03.mdx"),
  // CH04: 질문하기 — 상대에 맞게 묻다 (11:00)
  "ch04/clip01": () => import("@content/ch04/clip01.mdx"),
  "ch04/clip02": () => import("@content/ch04/clip02.mdx"),
  "ch04/clip03": () => import("@content/ch04/clip03.mdx"),
  // CH05: 실행하기 — 결과를 움직임으로 (13:30)
  "ch05/clip01": () => import("@content/ch05/clip01.mdx"),
  "ch05/clip02": () => import("@content/ch05/clip02.mdx"),
  "ch05/clip03": () => import("@content/ch05/clip03.mdx"),
  // CH06: 설득하기 — 데이터로 마음을 움직이다 (15:00)
  "ch06/clip01": () => import("@content/ch06/clip01.mdx"),
  "ch06/clip02": () => import("@content/ch06/clip02.mdx"),
  "ch06/clip03": () => import("@content/ch06/clip03.mdx"),
  "ch06/clip04": () => import("@content/ch06/clip04.mdx"),
  // CH07: 축적하기 — 오늘을 자산으로 남기다 (17:00)
  "ch07/clip01": () => import("@content/ch07/clip01.mdx"),
  "ch07/clip02": () => import("@content/ch07/clip02.mdx"),
  "ch07/clip03": () => import("@content/ch07/clip03.mdx"),
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
