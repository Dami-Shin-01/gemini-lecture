import curriculum from "../../content/curriculum.json";
import type { Curriculum, ClipNavigation } from "./types";

const data = curriculum as Curriculum;

export function getCurriculum(): Curriculum {
  return data;
}

export function getClipNavigation(
  chapterId: string,
  clipId: string
): ClipNavigation | null {
  const allClips: { chapter: (typeof data.chapters)[number]; clip: (typeof data.chapters)[number]["clips"][number] }[] = [];

  for (const chapter of data.chapters) {
    for (const clip of chapter.clips) {
      allClips.push({ chapter, clip });
    }
  }

  const currentIndex = allClips.findIndex(
    (item) => item.chapter.id === chapterId && item.clip.id === clipId
  );

  if (currentIndex === -1) return null;

  return {
    prev: currentIndex > 0 ? allClips[currentIndex - 1] : null,
    next: currentIndex < allClips.length - 1 ? allClips[currentIndex + 1] : null,
    current: allClips[currentIndex],
  };
}

export function getAllClipPaths(): { chapter: string; clip: string }[] {
  const paths: { chapter: string; clip: string }[] = [];
  for (const chapter of data.chapters) {
    for (const clip of chapter.clips) {
      paths.push({ chapter: chapter.id, clip: clip.id });
    }
  }
  return paths;
}

// 챕터의 진입 clip ID 반환 — curriculum.json clips 배열의 첫 항목.
// PR-B에서 DEEP DIVE 위치 재배치(ch02·ch07) 후 clip01이 첫 위치가 아닌 챕터가 생겼으므로,
// hardcoded `/chXX/clip01` 대신 이 helper 사용.
// chapterId 미존재 시 fallback "clip01" (안전 default).
export function getFirstClipId(chapterId: string): string {
  const chapter = data.chapters.find((c) => c.id === chapterId);
  return chapter?.clips[0]?.id ?? "clip01";
}
