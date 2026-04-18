import { getAllClipPaths, getClipNavigation } from "@/lib/navigation";
import { getMdxComponent } from "@/lib/content";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import ClipTabs from "@/components/layout/ClipTabs";
import DeepDiveGate from "@/components/content/DeepDiveGate";

export function generateStaticParams() {
  return getAllClipPaths();
}

export default async function ClipPage({
  params,
}: {
  params: Promise<{ chapter: string; clip: string }>;
}) {
  const { chapter, clip } = await params;
  const navigation = getClipNavigation(chapter, clip);

  if (!navigation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-text-muted">페이지를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const MdxContent = await getMdxComponent(chapter, clip);
  const chapterColor = navigation.current.chapter.colorTag;
  const currentClip = navigation.current.clip;

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        chapterTitle={navigation.current.chapter.title}
        clipTitle={currentClip.title}
      />
      <ClipTabs
        chapter={navigation.current.chapter}
        currentClipId={currentClip.id}
      />

      <div className="flex-1 max-w-[860px] mx-auto w-full px-6 py-10">
        {/* Content card — ticket 메타포 */}
        <article
          className="ticket-card overflow-hidden"
          data-active="true"
        >
          <div
            className="h-1"
            style={{ backgroundColor: chapterColor }}
            aria-hidden="true"
          />
          <div className="px-8 py-10 sm:px-10 sm:py-12">
            <div className="flex flex-wrap items-center gap-2 mb-6 text-[11px]">
              <span
                className="tabular-nums font-semibold tracking-wider"
                style={{ fontFamily: "var(--font-heading)", color: chapterColor }}
              >
                {navigation.current.chapter.time ?? "부록"}
              </span>
              {navigation.current.chapter.timeLabel && (
                <>
                  <span className="text-text-muted">·</span>
                  <span className="kicker !text-[10px]">
                    {navigation.current.chapter.timeLabel}
                  </span>
                </>
              )}
              {currentClip.deepDive && (
                <span
                  className="ml-auto text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-[var(--color-accent)]/15 text-[var(--color-accent)]"
                  title={currentClip.deepDiveNote || "심화 실습"}
                >
                  DEEP DIVE
                </span>
              )}
              {currentClip.durationMin && (
                <span className="text-text-muted tabular-nums">
                  ⏱ {currentClip.durationMin}분
                </span>
              )}
            </div>
            {currentClip.deepDive && (
              <DeepDiveGate
                note={currentClip.deepDiveNote}
                durationMin={currentClip.durationMin}
              />
            )}
            <div className="mdx-content">
              {MdxContent ? (
                <MdxContent />
              ) : (
                <p className="text-text-muted text-center py-20">
                  콘텐츠 준비 중입니다.
                </p>
              )}
            </div>
          </div>
        </article>
      </div>

      <BottomNav navigation={navigation} />
    </div>
  );
}
