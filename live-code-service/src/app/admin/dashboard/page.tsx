"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// ── 타입 ──────────────────────────────────────────────────────────

type ClassData = {
  id: string;
  name: string;
  scheduledAt: string | null;
  isActive: boolean;
  maxCodes: number | null;
  instructorContact: string | null;
  startedAt: string | null;
  endedAt: string | null;
  issuedCount: number;
};

type CodeData = {
  email: string;
  classId: string;
  code: string;
  issuedAt: string;
  isUsed: boolean;
  isRevoked: boolean;
};

type ConfirmModal = {
  classId: string;
  className: string;
  targetActive: boolean;
  maxCodes: number | null;
};

// ── 헬퍼 ──────────────────────────────────────────────────────────

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const dn = days[d.getDay()];
  const h = d.getHours();
  const min = d.getMinutes();
  const ampm = h < 12 ? "오전" : "오후";
  const h12 = h % 12 || 12;
  const ms = min ? `:${String(min).padStart(2, "0")}` : "";
  return `${m}월 ${day}일 (${dn}) ${ampm} ${h12}${ms}시`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

async function patchClass(classId: string, updates: Record<string, unknown>) {
  const res = await fetch(`/api/admin/classes/${classId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("PATCH_FAILED");
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"classes" | "codes">("classes");
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [codes, setCodes] = useState<CodeData[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingCodes, setLoadingCodes] = useState(false);
  const [codesClassId, setCodesClassId] = useState<string | null>(null);
  const [modal, setModal] = useState<ConfirmModal | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2500);
  }, []);

  const fetchClasses = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/classes");
      if (res.status === 401) { router.push("/admin"); return; }
      const { classes: data } = (await res.json()) as { classes: ClassData[] };
      setClasses(data);
    } finally {
      setLoadingClasses(false);
    }
  }, [router]);

  const fetchCodes = useCallback(async (classId: string | null) => {
    setLoadingCodes(true);
    try {
      const url = classId
        ? `/api/admin/codes?classId=${classId}`
        : "/api/admin/codes";
      const res = await fetch(url);
      const { codes: data } = (await res.json()) as { codes: CodeData[] };
      setCodes(data);
    } finally {
      setLoadingCodes(false);
    }
  }, []);

  useEffect(() => { fetchClasses(); }, [fetchClasses]);
  useEffect(() => {
    if (tab === "codes") fetchCodes(codesClassId);
  }, [tab, codesClassId, fetchCodes]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  // 세션 토글 확인 모달 → 실제 API 호출
  async function confirmToggle() {
    if (!modal) return;
    const { classId, targetActive } = modal;
    setModal(null);
    try {
      await patchClass(classId, { isActive: targetActive });
      await fetchClasses();
      showToast(targetActive ? "라이브를 시작했습니다." : "라이브를 종료했습니다.");
    } catch {
      showToast("오류가 발생했습니다. 다시 시도해 주세요.");
    }
  }

  // 코드 무효화 / 복구
  async function toggleRevoke(email: string, currentRevoked: boolean) {
    try {
      await fetch(`/api/admin/codes/${encodeURIComponent(email)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRevoked: !currentRevoked }),
      });
      setCodes((prev) =>
        prev.map((c) =>
          c.email === email ? { ...c, isRevoked: !currentRevoked } : c,
        ),
      );
    } catch {
      showToast("오류가 발생했습니다.");
    }
  }

  function downloadCsv() {
    const url = codesClassId
      ? `/api/admin/codes?classId=${codesClassId}&format=csv`
      : "/api/admin/codes?format=csv";
    window.open(url, "_blank");
  }

  // ── 활성 반 수 (EC-N12 배너)
  const activeCount = classes.filter((c) => c.isActive).length;
  const activeNames = classes
    .filter((c) => c.isActive)
    .map((c) => c.name)
    .join(", ");

  // ── 코드 탭 클래스 이름 조회용 맵
  const classNameMap = Object.fromEntries(classes.map((c) => [c.id, c.name]));

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-6 py-3 shadow-sm">
        <span className="text-lg font-bold text-gray-900">관리자 대시보드</span>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50"
        >
          로그아웃
        </button>
      </header>

      {/* 탭 */}
      <div className="border-b border-gray-200 bg-white px-6">
        <div className="flex gap-0">
          {(["classes", "codes"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`border-b-2 px-5 py-3 text-sm font-medium transition ${
                tab === t
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t === "classes" ? "반 제어" : "발급 내역"}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-6">
        {/* EC-N12: 활성 반 2개 이상 경고 배너 */}
        {activeCount >= 2 && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-orange-100 px-4 py-3 text-sm font-medium text-orange-800">
            ⚠️ 현재 활성 반: {activeNames} ({activeCount}개) — 여러 반이 동시에
            활성화되어 있습니다.
          </div>
        )}

        {tab === "classes" && (
          <ClassesTab
            classes={classes}
            loading={loadingClasses}
            onToggle={(cls) =>
              setModal({
                classId: cls.id,
                className: cls.name,
                targetActive: !cls.isActive,
                maxCodes: cls.maxCodes,
              })
            }
            onSaveMaxCodes={async (classId, val) => {
              await patchClass(classId, { maxCodes: val });
              await fetchClasses();
              showToast("수량 한도를 저장했습니다.");
            }}
            onSaveContact={async (classId, val) => {
              await patchClass(classId, { instructorContact: val || null });
              await fetchClasses();
              showToast("연락처를 저장했습니다.");
            }}
          />
        )}

        {tab === "codes" && (
          <CodesTab
            codes={codes}
            classes={classes}
            classNameMap={classNameMap}
            loading={loadingCodes}
            selectedClassId={codesClassId}
            onSelectClass={(id) => setCodesClassId(id)}
            onToggleRevoke={toggleRevoke}
            onDownloadCsv={downloadCsv}
          />
        )}
      </main>

      {/* 세션 전환 확인 모달 (EC-N10, EC-N11) */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <p className="mb-4 text-lg font-semibold text-gray-900">
              {modal.className} 라이브를{" "}
              {modal.targetActive ? "시작" : "종료"}하시겠습니까?
            </p>
            {modal.targetActive && (
              <div
                className={`mb-4 rounded-lg px-4 py-2.5 text-sm ${
                  modal.maxCodes === null
                    ? "bg-orange-50 text-orange-700"
                    : "bg-gray-50 text-gray-700"
                }`}
              >
                {modal.maxCodes === null ? (
                  <>⚠️ 수량 한도: <strong>미설정 (무제한)</strong></>
                ) : (
                  <>수량 한도: <strong>{modal.maxCodes}명</strong></>
                )}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={confirmToggle}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold text-white ${
                  modal.targetActive
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {modal.targetActive ? "시작" : "종료"}
              </button>
              <button
                onClick={() => setModal(null)}
                className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 토스트 */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-gray-900 px-5 py-2.5 text-sm text-white shadow-lg">
          {toastMsg}
        </div>
      )}
    </div>
  );
}

// ── SCR-04: 반 제어 탭 ────────────────────────────────────────────

function ClassesTab({
  classes,
  loading,
  onToggle,
  onSaveMaxCodes,
  onSaveContact,
}: {
  classes: ClassData[];
  loading: boolean;
  onToggle: (cls: ClassData) => void;
  onSaveMaxCodes: (classId: string, val: number | null) => Promise<void>;
  onSaveContact: (classId: string, val: string) => Promise<void>;
}) {
  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-gray-400">
        불러오는 중…
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="rounded-xl bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
        classes 컬렉션에 데이터가 없습니다.
        <br />
        Firestore에 class-1 ~ class-5 문서를 생성해 주세요.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {classes.map((cls) => (
        <ClassCard
          key={cls.id}
          cls={cls}
          onToggle={() => onToggle(cls)}
          onSaveMaxCodes={(val) => onSaveMaxCodes(cls.id, val)}
          onSaveContact={(val) => onSaveContact(cls.id, val)}
        />
      ))}
    </div>
  );
}

function ClassCard({
  cls,
  onToggle,
  onSaveMaxCodes,
  onSaveContact,
}: {
  cls: ClassData;
  onToggle: () => void;
  onSaveMaxCodes: (val: number | null) => Promise<void>;
  onSaveContact: (val: string) => Promise<void>;
}) {
  const [maxInput, setMaxInput] = useState(
    cls.maxCodes !== null ? String(cls.maxCodes) : "",
  );
  const [contactInput, setContactInput] = useState(
    cls.instructorContact ?? "",
  );
  const [savingMax, setSavingMax] = useState(false);
  const [savingContact, setSavingContact] = useState(false);

  const pct =
    cls.maxCodes !== null && cls.maxCodes > 0
      ? Math.min(100, Math.round((cls.issuedCount / cls.maxCodes) * 100))
      : null;

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-lg font-bold text-gray-900">{cls.name}</p>
          {cls.scheduledAt && (
            <p className="text-sm text-gray-500">
              예정: {formatDateTime(cls.scheduledAt)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold ${cls.isActive ? "text-green-600" : "text-red-500"}`}
          >
            {cls.isActive ? "🟢 ON" : "🔴 OFF"}
          </span>
          {cls.isActive && cls.startedAt && (
            <span className="text-xs text-gray-400">
              {formatTime(cls.startedAt)} 시작
            </span>
          )}
        </div>
      </div>

      {/* 발급 현황 */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            발급: {cls.issuedCount}건
            {cls.maxCodes !== null ? ` / ${cls.maxCodes}건` : ""}
          </span>
          {pct !== null && (
            <span className="text-xs text-gray-400">{pct}%</span>
          )}
        </div>
        {pct !== null && (
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>

      {/* 세션 토글 버튼 */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={onToggle}
          className={`min-h-[40px] rounded-lg px-5 text-sm font-semibold text-white transition ${
            cls.isActive
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {cls.isActive ? "라이브 종료" : "라이브 시작"}
        </button>

        {/* 수량 한도 */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            placeholder="무제한"
            className="w-24 rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          <span className="text-xs text-gray-500">명</span>
          <button
            disabled={savingMax}
            onClick={async () => {
              setSavingMax(true);
              await onSaveMaxCodes(
                maxInput === "" ? null : parseInt(maxInput, 10),
              );
              setSavingMax(false);
            }}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200 disabled:opacity-50"
          >
            {savingMax ? "저장 중…" : "저장"}
          </button>
        </div>
      </div>

      {/* 운영자 연락처 */}
      <div className="mt-3 flex items-center gap-2">
        <input
          type="tel"
          value={contactInput}
          onChange={(e) => setContactInput(e.target.value)}
          placeholder="운영자 연락처 (예: 010-1234-5678)"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        <button
          disabled={savingContact}
          onClick={async () => {
            setSavingContact(true);
            await onSaveContact(contactInput);
            setSavingContact(false);
          }}
          className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200 disabled:opacity-50"
        >
          {savingContact ? "저장 중…" : "저장"}
        </button>
      </div>
    </div>
  );
}

// ── SCR-05: 발급 내역 탭 ──────────────────────────────────────────

function CodesTab({
  codes,
  classes,
  classNameMap,
  loading,
  selectedClassId,
  onSelectClass,
  onToggleRevoke,
  onDownloadCsv,
}: {
  codes: CodeData[];
  classes: ClassData[];
  classNameMap: Record<string, string>;
  loading: boolean;
  selectedClassId: string | null;
  onSelectClass: (id: string | null) => void;
  onToggleRevoke: (email: string, current: boolean) => Promise<void>;
  onDownloadCsv: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* 필터 + CSV */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <FilterBtn
            label="전체"
            active={selectedClassId === null}
            onClick={() => onSelectClass(null)}
          />
          {classes.map((c) => (
            <FilterBtn
              key={c.id}
              label={c.name}
              active={selectedClassId === c.id}
              onClick={() => onSelectClass(c.id)}
            />
          ))}
        </div>
        <button
          onClick={onDownloadCsv}
          className="rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          CSV 다운로드
        </button>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        {loading ? (
          <div className="py-10 text-center text-sm text-gray-400">
            불러오는 중…
          </div>
        ) : codes.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">
            발급 내역이 없습니다.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs font-medium text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">이메일</th>
                <th className="px-3 py-3 text-left">반</th>
                <th className="px-3 py-3 text-left">코드</th>
                <th className="px-3 py-3 text-left">발급 시각</th>
                <th className="px-3 py-3 text-center">상태</th>
                <th className="px-3 py-3 text-center">액션</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((c) => (
                <tr
                  key={c.email}
                  className={`border-b border-gray-50 last:border-0 ${c.isRevoked ? "opacity-50" : ""}`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-gray-800">
                    {c.email}
                  </td>
                  <td className="px-3 py-3 text-gray-700">
                    {classNameMap[c.classId] ?? c.classId}
                  </td>
                  <td className="px-3 py-3 font-mono font-semibold text-gray-900">
                    {c.code}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-gray-500">
                    {c.issuedAt ? formatTime(c.issuedAt) : "—"}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        c.isRevoked
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {c.isRevoked ? "무효" : "정상"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <button
                      onClick={() => onToggleRevoke(c.email, c.isRevoked)}
                      className={`rounded px-2 py-1 text-xs font-medium transition ${
                        c.isRevoked
                          ? "text-green-700 hover:bg-green-50"
                          : "text-red-600 hover:bg-red-50"
                      }`}
                    >
                      {c.isRevoked ? "복구" : "무효화"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-gray-400">
        최대 1,000건 표시 · 발급 최신순 정렬
      </p>
    </div>
  );
}

function FilterBtn({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-sm font-medium transition ${
        active
          ? "bg-blue-600 text-white"
          : "bg-white text-gray-600 ring-1 ring-gray-300 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}
