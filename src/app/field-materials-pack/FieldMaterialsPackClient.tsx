"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ExternalLink, FileText, Sparkles, ArrowRight } from "lucide-react";
import MaterialsChecklist from "@/components/prep/MaterialsChecklist";
import type { MaterialsItem } from "@/lib/materials";

const NOTEBOOK_URL =
  process.env.NEXT_PUBLIC_NOTEBOOKLM_SHARE_URL ?? "https://notebooklm.google.com/";

const SOURCES: { id: MaterialsItem; label: string; desc: string; stamp: string }[] = [
  {
    id: "source-interview",
    label: "간담회 속기록 (3건)",
    desc: "지난 분기 전사 간담회 발언 원문. 화자·시간 태그 포함.",
    stamp: "02",
  },
  {
    id: "source-anonymous",
    label: "익명 제보 샘플 (10건)",
    desc: "사내 VoE 채널 수신. 개인정보 마스킹 완료.",
    stamp: "03",
  },
  {
    id: "source-survey",
    label: "구성원 설문 (50건)",
    desc: "5점 척도 + 자유응답. CSV 원본 그대로 업로드 가능.",
    stamp: "04",
  },
  {
    id: "source-answers",
    label: "경영진 답변 사례",
    desc: "과거 VoE에 경영진이 어떻게 응답했는지 이력.",
    stamp: "05",
  },
];

// Gems는 "이름 + 한 줄 설명 + 어느 챕터에서 만드는지"만 미리보기.
// 인스트럭션 전문·생성 단계는 해당 챕터에서 다룬다 (5인 페르소나 리뷰 합의:
// 사전 노출 시 맥락 없이 전시되어 인지 부담 발생, advance organizer 수준만 유지).
const GEMS: {
  id: MaterialsItem;
  term: string;
  desc: string;
  clipRef: string;
  clipName: string;
}[] = [
  {
    id: "gem-voe",
    term: "VoE 분석가 Gem",
    desc: "구성원 자유응답 → 패턴·감정 클러스터 추출",
    clipRef: "ch02/clip03",
    clipName: "ch02 듣기",
  },
  {
    id: "gem-persona-senior",
    term: "페르소나 · 베테랑 Gem",
    desc: "10년차 시니어 시각으로 답변 시뮬레이션",
    clipRef: "ch04/clip01",
    clipName: "ch04 질문하기",
  },
  {
    id: "gem-persona-mid",
    term: "페르소나 · 중견 Gem",
    desc: "5년차 실무자 시각으로 답변 시뮬레이션",
    clipRef: "ch04/clip01",
    clipName: "ch04 질문하기",
  },
  {
    id: "gem-persona-mz",
    term: "페르소나 · MZ Gem",
    desc: "신입~3년차 시각으로 답변 시뮬레이션",
    clipRef: "ch04/clip01",
    clipName: "ch04 질문하기",
  },
  {
    id: "gem-reviewer",
    term: "까다로운 검토자 Gem",
    desc: "경영진 시각의 반론·허점 검증",
    clipRef: "ch06/clip04",
    clipName: "ch06 설득하기",
  },
];

export default function FieldMaterialsPackClient() {
  useEffect(() => {
    // ch02(morning)에서 진입 시 phase 전환 충격 방지. 이 페이지는 "실습 시작 전"이라 morning 고정.
    const prev = document.body.dataset.time;
    document.body.dataset.time = "morning";
    return () => {
      if (prev) document.body.dataset.time = prev;
    };
  }, []);

  return (
    <div className="max-w-[860px] mx-auto px-6 py-16">
      <p className="kicker mb-3">시작 전 준비 · 3분</p>
      <h1 className="hero-display !text-[clamp(2.25rem,5vw,3.5rem)] mb-6">
        실습에 필요한 <span className="accent-weight">자료 팩</span>
      </h1>
      <p className="text-[15px] text-text-secondary mb-2 max-w-[620px]">
        NotebookLM 공유 노트북 · 원본 소스 4종 · Gem 인스트럭션 묶음 —
        강의 시작 전에 본인 계정으로 받아 오세요.
      </p>
      <p className="text-xs text-text-muted mb-12 max-w-[620px]">
        이 실습의 인물·부서·사건은 모두 가상이며 교육용 샘플입니다.
      </p>

      {/* Block B — NotebookLM */}
      <section aria-label="NotebookLM 공유 노트북" className="mb-6">
        <div className="ticket-card ticket-card--alt flex items-stretch overflow-hidden">
          <div className="flex-1 p-6 sm:p-7">
            <p className="kicker mb-3">SOURCE · 01 · NOTEBOOK</p>
            <h2
              className="text-[1.375rem] font-semibold text-text-primary mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              JB Field Materials Pack — NotebookLM
            </h2>
            <p className="text-sm text-text-secondary mb-4">
              원본 4종 소스가 이미 붙어 있는 공유 노트북. 여는 즉시{" "}
              <strong className="text-text-primary">&lsquo;복제(Make a copy)&rsquo;</strong>를
              눌러 본인 드라이브로 이동하세요. 원본은 읽기 전용입니다.
            </p>
            <a
              href={NOTEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 min-h-[44px] px-5 rounded-full bg-[var(--color-accent)] text-white text-sm font-semibold hover:bg-[var(--color-accent-dark)] transition-colors"
            >
              <ExternalLink size={14} />
              공유 노트북 열기
            </a>
          </div>
          <div className="ticket-stamp">
            <span className="ticket-stamp__num">01</span>
            <span className="ticket-stamp__label">NOTEBOOK</span>
          </div>
        </div>
      </section>

      {/* Block C — Sources 4 (2×2 grid + 교차) */}
      <section aria-label="원본 소스 4종" className="mb-6">
        <p className="kicker px-1 mb-3">원본 소스 4종 · 노트북에 이미 포함됨</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SOURCES.map((src, i) => {
            // 2-column grid 대각선 체커보드 (row + col) % 2.
            const alt = (Math.floor(i / 2) + (i % 2)) % 2 === 1;
            return (
            <a
              key={src.id}
              href={`#${src.id}`}
              onClick={(e) => e.preventDefault()}
              className={`ticket-card ${alt ? "ticket-card--alt" : ""} flex items-stretch overflow-hidden`}
            >
              <div className="flex-1 p-5">
                <p className="kicker !text-[10px] mb-1">
                  SOURCE · {src.stamp} · FILE
                </p>
                <h3
                  className="text-[15px] font-semibold text-text-primary mb-1"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {src.label}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">{src.desc}</p>
              </div>
              <div className="ticket-stamp">
                <span className="ticket-stamp__num">{src.stamp}</span>
                <span className="ticket-stamp__label">SOURCE</span>
              </div>
            </a>
            );
          })}
        </div>
      </section>

      {/* Block D — Gem instructions (이름 + 한 줄 + 챕터 연결만, 전문은 챕터에서) */}
      <section aria-label="Gem 인스트럭션 모음" className="mb-6">
        <div className="ticket-card ticket-card--alt flex items-stretch overflow-hidden">
          <div className="flex-1 p-6 sm:p-7">
            <p className="kicker mb-3">GEMS · 06 · 미리보기</p>
            <h2
              className="text-[1.375rem] font-semibold text-text-primary mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              직접 만들 Gem 5종 미리보기
            </h2>
            <p className="text-sm text-text-secondary mb-4">
              지금은 <strong className="text-text-primary">이름과 역할만</strong> 알아두세요.
              인스트럭션 전문과 만드는 단계는 아래 표시된 챕터에서 함께 다룹니다 — 미리 외울 필요는 없습니다.
            </p>
            <ul className="flex flex-col gap-2 text-sm">
              {GEMS.map((g) => (
                <li key={g.id}>
                  <Link
                    href={`/${g.clipRef}`}
                    className="flex items-start gap-2.5 min-h-[44px] py-1 text-text-secondary hover:text-[var(--color-accent)] transition-colors group"
                  >
                    <Sparkles
                      size={14}
                      className="mt-0.5 shrink-0 text-[var(--color-time-accent)]"
                      aria-hidden="true"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="font-medium text-text-primary">{g.term}</span>
                        <span className="text-[11px] text-text-muted">
                          {g.clipName}에서 함께 만듭니다
                        </span>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed mt-0.5">
                        {g.desc}
                      </p>
                    </div>
                    <ArrowRight
                      size={13}
                      className="mt-1 shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="ticket-stamp">
            <span className="ticket-stamp__num">06</span>
            <span className="ticket-stamp__label">GEMS</span>
          </div>
        </div>
      </section>

      <div className="my-8 h-1 bg-[var(--color-accent)]" aria-hidden="true" />

      <MaterialsChecklist />

      <div className="mt-10 flex items-center gap-2 text-xs text-text-muted">
        <FileText size={12} />
        환경 변수 `NEXT_PUBLIC_NOTEBOOKLM_SHARE_URL`이 설정되지 않으면
        NotebookLM 메인 페이지로 연결됩니다.
      </div>
    </div>
  );
}
