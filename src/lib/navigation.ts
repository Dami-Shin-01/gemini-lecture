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
