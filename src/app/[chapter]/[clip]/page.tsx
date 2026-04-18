import { getAllClipPaths, getClipNavigation } from "@/lib/navigation";
import { getMdxComponent } from "@/lib/content";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

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

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        chapterTitle={navigation.current.chapter.title}
        clipTitle={navigation.current.clip.title}
      />

      <div className="flex-1 max-w-[860px] mx-auto w-full px-6 py-10">
        {/* Content card — ticket 메타포 */}
        <div className="surface rounded-[4px_4px_20px_4px] border border-cream-dark overflow-hidden shadow-[0_1px_0_rgba(0,0,0,0.04)]">
          <div
            className="h-1"
            style={{ backgroundColor: chapterColor }}
            aria-hidden="true"
          />
          <div className="px-8 py-10 sm:px-10 sm:py-12">
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
        </div>
      </div>

      <BottomNav navigation={navigation} />
    </div>
  );
}
