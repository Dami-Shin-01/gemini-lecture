"use client";

import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "live_code_last_email";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FETCH_TIMEOUT_MS = 10_000;

// ── 타입 ────────────────────────────────────────────────────────

type ClassData = {
  classId: string;
  className: string;
  scheduledAt: string | null;
  isActive: boolean;
  contact: string | null;
};

type Step =
  | { view: "form"; loading?: boolean; err?: string }
  | { view: "confirm"; email: string; cls: ClassData; loading?: boolean }
  | { view: "conflict"; email: string; cls: ClassData }
  | {
      view: "success";
      email: string;
      className: string;
      code: string;
      alreadyIssued: boolean;
      contact: string | null;
    }
  | {
      view: "error";
      kind: string;
      email: string;
      cls?: Partial<ClassData>;
    };

// ── 헬퍼 ─────────────────────────────────────────────────────────

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dayName = days[d.getDay()];
  const hour = d.getHours();
  const min = d.getMinutes();
  const ampm = hour < 12 ? "오전" : "오후";
  const h12 = hour % 12 || 12;
  const ms = min ? `:${String(min).padStart(2, "0")}` : "";
  return `${month}월 ${day}일 (${dayName}) ${ampm} ${h12}${ms}시`;
}

function ContactLine({ contact }: { contact: string | null | undefined }) {
  if (!contact) return null;
  return (
    <a
      href={`tel:${contact.replace(/[^0-9]/g, "")}`}
      className="mt-1 block text-sm font-medium text-current underline"
    >
      📞 {contact}
    </a>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<Step>({ view: "form" });
  const [copied, setCopied] = useState(false);
  const [clipboardFailed, setClipboardFailed] = useState(false);
  // MEMBER_NOT_FOUND 연속 실패 횟수 — 3회 이상 시 연락처 강조 (FR-06-07)
  const failCount = useRef(0);

  // 앱 전환 후 재진입 시 이메일 자동 복원 (EC-N06, FR-06-09)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) setEmail(saved);
    } catch {
      // sessionStorage 미지원 환경 무시
    }
  }, []);

  // ── 이벤트 핸들러 ──────────────────────────────────────────────

  async function handleCheckMember(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();

    if (!EMAIL_RE.test(trimmed)) {
      setStep({ view: "form", err: "INVALID_EMAIL" });
      return;
    }

    setStep({ view: "form", loading: true });

    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
      const res = await fetch("/api/check-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);

      const data = (await res.json()) as Record<string, unknown>;

      if (res.ok) {
        failCount.current = 0;
        const cls: ClassData = {
          classId: data.classId as string,
          className: data.className as string,
          scheduledAt: data.scheduledAt as string | null,
          isActive: data.isActive as boolean,
          contact: data.contact as string | null,
        };
        try {
          sessionStorage.setItem(SESSION_KEY, trimmed);
        } catch { /* ignore */ }
        setStep({ view: "confirm", email: trimmed, cls });
      } else {
        const errCode = data.error as string;
        if (errCode === "MEMBER_NOT_FOUND") failCount.current++;
        setStep({ view: "form", err: errCode });
      }
    } catch (err) {
      const kind =
        err instanceof Error && err.name === "AbortError"
          ? "NETWORK_ERROR"
          : "SERVER_ERROR";
      setStep({ view: "form", err: kind });
    }
  }

  async function handleIssueCode(
    email: string,
    cls: ClassData,
  ) {
    setStep({ view: "confirm", email, cls, loading: true });

    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
      const res = await fetch("/api/issue-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);

      const data = (await res.json()) as Record<string, unknown>;
      const className = (data.className as string | undefined) ?? cls.className;
      const contact = (data.contact as string | null | undefined) ?? cls.contact;

      if (res.status === 200 || res.status === 201) {
        setStep({
          view: "success",
          email,
          className,
          code: data.code as string,
          alreadyIssued: !!(data.alreadyIssued),
          contact,
        });
      } else {
        const kind = data.error as string;
        setStep({
          view: "error",
          kind,
          email,
          cls: {
            className,
            scheduledAt: (data.scheduledAt as string | null | undefined) ?? cls.scheduledAt,
            contact,
          },
        });
      }
    } catch (err) {
      const kind =
        err instanceof Error && err.name === "AbortError"
          ? "NETWORK_ERROR"
          : "SERVER_ERROR";
      setStep({ view: "error", kind, email, cls: { contact: cls.contact } });
    }
  }

  async function handleCopy(code: string) {
    if (!navigator?.clipboard?.writeText) {
      setClipboardFailed(true);
      return;
    }
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setClipboardFailed(true);
    }
  }

  function goToForm(clearEmail = false) {
    if (clearEmail) setEmail("");
    failCount.current = 0;
    setClipboardFailed(false);
    setCopied(false);
    setStep({ view: "form" });
  }

  // ── 렌더링 ────────────────────────────────────────────────────

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">코드 받기</h1>
          {renderContent()}
        </div>
      </div>
    </main>
  );

  function renderContent() {
    switch (step.view) {
      case "form":
        return renderEmailForm(step.err, step.loading);
      case "confirm":
        return renderConfirm(step.email, step.cls, step.loading);
      case "conflict":
        return renderConflict(step.email, step.cls);
      case "success":
        return renderSuccess(step);
      case "error":
        return renderError(step);
    }
  }

  // SCR-01A — 이메일 입력
  function renderEmailForm(err?: string, loading?: boolean) {
    return (
      <div>
        <p className="mb-6 text-base text-gray-500">
          강의에 등록하신 이메일을 입력하시면 어느 반인지 확인해 드릴게요.
        </p>

        <form onSubmit={handleCheckMember} noValidate className="space-y-3">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              이메일 주소
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (step.view === "form" && step.err) {
                  setStep({ view: "form" });
                }
              }}
              placeholder="예) 홍길동@naver.com"
              className={`w-full rounded-lg border px-4 py-3 text-base text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-blue-500/20 ${
                err === "INVALID_EMAIL" || err === "MEMBER_NOT_FOUND"
                  ? "border-red-400 focus:border-red-400"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
          </div>

          {/* 인라인 에러 */}
          {err && renderInlineError(err)}

          <button
            type="submit"
            disabled={!!loading}
            className="flex min-h-[48px] w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Spinner /> 확인하는 중이에요…
              </span>
            ) : (
              "내 반 확인하기"
            )}
          </button>
        </form>
      </div>
    );
  }

  function renderInlineError(err: string) {
    // INVALID_EMAIL
    if (err === "INVALID_EMAIL") {
      return (
        <div className="rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          <p className="font-medium">이메일 주소를 확인해 주세요.</p>
          <p className="mt-1 text-yellow-700">
            @ 기호와 점(.)이 모두 있어야 합니다.
            <br />예) 홍길동@naver.com
          </p>
        </div>
      );
    }

    // MEMBER_NOT_FOUND
    if (err === "MEMBER_NOT_FOUND") {
      return (
        <div className="rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          <p className="font-medium">
            입력하신 이메일로 등록된 정보를 찾을 수 없습니다.
          </p>
          <ul className="mt-2 list-inside list-disc space-y-0.5 text-yellow-700">
            <li>강의 신청할 때 쓴 이메일인가요?</li>
            <li>@naver.com 등 도메인까지 정확하게 입력하셨나요?</li>
            <li>혹시 다른 이메일이 있으신가요?</li>
          </ul>
          {failCount.current >= 3 && (
            <div className="mt-3 border-t border-yellow-200 pt-3">
              <p className="font-medium">그래도 안 되시면 강사 선생님께 직접 문의해 주세요.</p>
            </div>
          )}
        </div>
      );
    }

    // TOO_MANY_REQUESTS
    if (err === "TOO_MANY_REQUESTS") {
      return (
        <div className="rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          <p className="font-medium">잠시 후 다시 시도해 주세요.</p>
          <p className="mt-1 text-yellow-700">너무 빠른 요청이 감지되었습니다.</p>
        </div>
      );
    }

    // SERVER_ERROR / NETWORK_ERROR / 기타
    return (
      <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
        <p className="font-medium">일시적인 문제가 생겼습니다.</p>
        <p className="mt-1 text-red-600">
          {err === "NETWORK_ERROR"
            ? "인터넷 연결을 확인하신 후 다시 시도해 주세요."
            : "잠시 후 아래 버튼을 눌러 다시 시도해 주세요."}
        </p>
      </div>
    );
  }

  // SCR-01B — 반 확인
  function renderConfirm(email: string, cls: ClassData, loading?: boolean) {
    const { className, scheduledAt, isActive } = cls;
    const dateStr = formatDate(scheduledAt);

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          아래 정보가 맞으시면 코드를 받아보세요.
        </p>

        {/* 반 정보 카드 */}
        <div className="rounded-xl bg-blue-50 px-5 py-4">
          <p className="mb-1 text-sm text-blue-600">{email}</p>
          <p className="text-3xl font-bold text-blue-900">{className}</p>
          {dateStr && (
            <p className="mt-1 text-sm text-blue-700">📅 {dateStr}</p>
          )}
          {!isActive && (
            <p className="mt-3 rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-800">
              아직 <span className="font-semibold">{className}</span> 강의가
              시작되지 않았어요. 강사 선생님의 안내를 기다려 주세요.
            </p>
          )}
        </div>

        {/* 확인 버튼 */}
        <button
          onClick={() => !loading && handleIssueCode(email, cls)}
          disabled={!!loading}
          className="flex min-h-[52px] w-full items-center justify-center rounded-lg bg-green-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Spinner /> 발급 중이에요…
            </span>
          ) : isActive ? (
            "✓  맞아요, 코드 받기"
          ) : (
            "강의 시작 후 코드 받기"
          )}
        </button>

        {/* 반 불일치 링크 — 버튼과 최소 24px 간격 (EC-N04) */}
        <div className="pt-2 text-center">
          <button
            onClick={() => setStep({ view: "conflict", email, cls })}
            className="text-sm text-gray-400 underline underline-offset-2 transition hover:text-gray-600"
          >
            이 반이 아닌 것 같아요
          </button>
        </div>
      </div>
    );
  }

  // SCR-ERR-G — 반 불일치 신고
  function renderConflict(email: string, cls: ClassData) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl bg-indigo-50 px-5 py-4">
          <p className="mb-3 font-semibold text-indigo-900">
            강사 선생님께 확인해 주세요
          </p>
          <p className="text-sm text-indigo-800">
            입력하신 이메일에
          </p>
          <p className="my-1 font-medium text-indigo-900">{email}</p>
          <p className="text-sm text-indigo-800">
            →{" "}
            <span className="font-semibold">{cls.className}</span>으로 등록되어
            있습니다.
          </p>
          <p className="mt-3 text-sm text-indigo-700">
            다른 반에 수강 신청하셨다면 강사 선생님께 말씀해 주시면 수정해
            드릴 수 있습니다.
          </p>
          <ContactLine contact={cls.contact} />
        </div>

        {/* 돌아가서 코드 받기 (EC-N04) */}
        <button
          onClick={() => setStep({ view: "confirm", email, cls })}
          className="flex min-h-[48px] w-full items-center justify-center rounded-lg bg-green-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-green-700"
        >
          ← 돌아가서 코드 받기
        </button>

        <div className="text-center">
          <button
            onClick={() => goToForm(true)}
            className="text-sm text-gray-400 underline underline-offset-2 transition hover:text-gray-600"
          >
            다른 이메일로 다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  // SCR-02 — 발급 완료
  function renderSuccess(s: Extract<Step, { view: "success" }>) {
    const { email, className, code, alreadyIssued, contact } = s;

    return (
      <div className="space-y-4">
        <div className={`rounded-xl px-5 py-4 ${alreadyIssued ? "bg-blue-50" : "bg-green-50"}`}>
          <p className={`mb-1 text-sm font-medium ${alreadyIssued ? "text-blue-700" : "text-green-700"}`}>
            {alreadyIssued
              ? "이전에 발급받으신 코드입니다. 그대로 사용하시면 됩니다."
              : "✓ 코드가 준비됐습니다!"}
          </p>
          <p className={`mb-3 text-sm ${alreadyIssued ? "text-blue-600" : "text-green-600"}`}>
            {email} · {className}
          </p>

          {/* 코드 표시 */}
          <div className="rounded-lg bg-white px-4 py-3 ring-1 ring-gray-200">
            <p className="whitespace-nowrap font-mono text-3xl font-bold tracking-widest text-gray-900">
              {code}
            </p>
          </div>

          {/* 복사 버튼 / 폴백 */}
          {clipboardFailed ? (
            <div className="mt-3">
              <p className="mb-1 text-xs text-gray-500">
                아래 코드를 꾹 눌러 복사하세요.
              </p>
              <input
                type="text"
                readOnly
                value={code}
                onFocus={(e) => e.target.select()}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm text-gray-900"
              />
            </div>
          ) : (
            <button
              onClick={() => handleCopy(code)}
              className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              {copied ? "✓ 복사되었습니다!" : "📋 코드 복사하기"}
            </button>
          )}
        </div>

        <div className="space-y-1 text-sm text-gray-500">
          <p>지금 스크린샷을 찍어두시면 편리합니다.</p>
          <p>
            화면을 닫으셔도 걱정 마세요.{" "}
            <span className="text-gray-700">
              같은 이메일을 다시 입력하면 코드를 다시 볼 수 있습니다.
            </span>
          </p>
          <p>강사 선생님께 이 화면을 그대로 보여주시면 됩니다.</p>
        </div>

        {contact && (
          <p className="text-sm text-gray-500">
            문의: <ContactLine contact={contact} />
          </p>
        )}

        <div className="pt-1 text-center">
          <button
            onClick={() => goToForm(true)}
            className="text-sm text-gray-400 underline underline-offset-2 transition hover:text-gray-600"
          >
            다른 이메일로 받기
          </button>
        </div>
      </div>
    );
  }

  // 에러 풀스크린 — SCR-ERR-B/C/E/F/H
  function renderError(s: Extract<Step, { view: "error" }>) {
    const { kind, email, cls } = s;
    const className = cls?.className;
    const contact = cls?.contact;
    const scheduledAt = cls?.scheduledAt;

    switch (kind) {
      // SCR-ERR-B 강의 시작 전
      case "SESSION_NOT_STARTED": {
        const dateStr = formatDate(scheduledAt ?? null);
        return (
          <div className="space-y-4">
            <div className="rounded-xl bg-blue-50 px-5 py-4">
              <p className="mb-2 text-lg font-semibold text-blue-900">
                🕐 곧 시작됩니다
              </p>
              <p className="text-sm text-blue-800">
                아직{className ? ` ${className} ` : " "}코드 발급이 시작되지
                않았습니다.
              </p>
              <p className="mt-2 text-sm text-blue-700">
                강사 선생님이 시작을 알려주시면 다시 이 화면에서 받으실 수
                있습니다.
              </p>
              {dateStr && (
                <p className="mt-3 text-sm font-medium text-blue-800">
                  📅 예정: {dateStr}
                </p>
              )}
              <ContactLine contact={contact ?? null} />
            </div>
            <button
              onClick={() =>
                setStep({ view: "confirm", email, cls: cls as ClassData })
              }
              className="flex min-h-[48px] w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
            >
              다시 시도해 보기
            </button>
          </div>
        );
      }

      // SCR-ERR-C 강의 종료 후
      case "SESSION_ENDED":
        return (
          <div className="space-y-4">
            <div className="rounded-xl bg-gray-100 px-5 py-4">
              <p className="mb-2 text-lg font-semibold text-gray-800">
                📌 코드 발급이 종료되었습니다
              </p>
              <p className="text-sm text-gray-700">
                {className ? `${className} 강의의 ` : ""}코드 발급이
                마감되었습니다.
              </p>
              <p className="mt-2 text-sm text-gray-600">
                코드를 받지 못하셨다면 강사 선생님께 직접 문의해 주세요.
              </p>
              <ContactLine contact={contact ?? null} />
            </div>
            {/* EC-N05 대응: 세션 재활성 가능성에 대비 */}
            <button
              onClick={() =>
                setStep({ view: "confirm", email, cls: cls as ClassData })
              }
              className="flex min-h-[48px] w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-base font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              잠시 후 다시 시도하기
            </button>
            <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
              <p className="mb-2">혹시 이미 코드를 받으셨나요?</p>
              <button
                onClick={() => handleIssueCode(email, cls as ClassData)}
                className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                발급된 코드 다시 확인하기
              </button>
            </div>
          </div>
        );

      // SCR-ERR-E 수량 소진
      case "QUOTA_EXCEEDED":
        return (
          <div className="rounded-xl bg-orange-50 px-5 py-4">
            <p className="mb-2 text-lg font-semibold text-orange-900">
              😔 코드가 모두 소진됐습니다
            </p>
            <p className="text-sm text-orange-800">
              {className ? `${className}에 ` : ""}준비된 코드가 모두
              발급되었습니다.
            </p>
            <p className="mt-2 text-sm text-orange-700">
              강사 선생님께 직접 말씀해 주시면 도움을 드릴 수 있습니다.
            </p>
            <ContactLine contact={contact ?? null} />
          </div>
        );

      // SCR-ERR-H 반 배정 오류
      case "CLASS_NOT_ASSIGNED":
        return (
          <div className="rounded-xl bg-orange-50 px-5 py-4">
            <p className="mb-2 text-lg font-semibold text-orange-900">
              ⚠️ 반 배정 정보를 확인 중입니다
            </p>
            <p className="text-sm text-orange-800">
              현재 반 배정이 완료되지 않은 상태입니다.
            </p>
            <p className="mt-2 text-sm text-orange-700">
              강사 선생님께 아래 내용을 알려주시면 빠르게 도와드릴게요.
            </p>
            <div className="mt-3 rounded-lg bg-white px-3 py-2 text-sm">
              <p className="text-gray-600">• 입력하신 이메일</p>
              <p className="font-medium text-gray-900">{email}</p>
              <p className="mt-1 text-gray-500">
                • 오류 코드: CLASS_NOT_ASSIGNED
              </p>
            </div>
            <ContactLine contact={contact ?? null} />
          </div>
        );

      // SCR-ERR-F 네트워크·서버 오류
      default:
        return (
          <div className="space-y-4">
            <div className="rounded-xl bg-red-50 px-5 py-4">
              <p className="mb-2 text-lg font-semibold text-red-900">
                📶 연결이 원활하지 않습니다
              </p>
              <div className="space-y-1.5 text-sm text-red-800">
                <p>1. 와이파이나 데이터가 연결되어 있는지 확인해 주세요.</p>
                <p>2. 아래 버튼을 눌러 다시 시도해 주세요.</p>
                <p>3. 계속 안 된다면 강사 선생님께 알려주세요.</p>
              </div>
              <ContactLine contact={contact ?? null} />
            </div>
            <button
              onClick={() => goToForm()}
              className="flex min-h-[48px] w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
            >
              다시 시도하기
            </button>
          </div>
        );
    }
  }
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}
