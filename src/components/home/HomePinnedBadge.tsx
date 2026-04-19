"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pin, ArrowRight } from "lucide-react";
import { track } from "@/lib/analytics";
import { loadRetro } from "@/lib/retro";
import curriculum from "../../../content/curriculum.json";
import type { Curriculum } from "@/lib/types";

const data = curriculum as Curriculum;

function findClip(pinId: string): { title: string; chapterName: string } | null {
  const [chId, clId] = pinId.split("/");
  if (!chId || !clId) return null;
  const chapter = data.chapters.find((c) => c.id === chId);
  if (!chapter) return null;
  const clip = chapter.clips.find((c) => c.id === clId);
  if (!clip) return null;
  return {
    title: clip.title,
    chapterName: chapter.title.split(" — ")[0],
  };
}

export default function HomePinnedBadge() {
  const [pinId, setPinId] = useState<string | null>(null);

  useEffect(() => {
    const retro = loadRetro();
    setPinId(retro.pin_clip ?? null);
  }, []);

  if (!pinId) return null;
  const info = findClip(pinId);
  if (!info) return null;

  const href = `/${pinId}`;

  return (
    <div className="mt-6 inline-flex items-center gap-3 p-3 rounded-xl border border-dashed border-[var(--color-accent)]/40 bg-[var(--color-accent)]/5 max-w-full">
      <span
        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)] shrink-0"
        aria-hidden="true"
      >
        <Pin size={14} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-text-muted mb-0.5">
          지난 회고에서 핀 · {info.chapterName}
        </p>
        <p className="text-sm text-text-primary truncate">{info.title}</p>
      </div>
      <Link
        href={href}
        onClick={() =>
          track("hero_cta_click", {
            target: pinId,
            source: "retro_pin",
          })
        }
        className="inline-flex items-center gap-1 shrink-0 min-h-[40px] px-3 rounded-full bg-[var(--color-accent)] text-white text-xs font-semibold hover:bg-[var(--color-accent-dark)] transition-colors"
      >
        바로 이어가기
        <ArrowRight size={13} />
      </Link>
    </div>
  );
}
