"use client";

import { useState } from "react";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; code: string; alreadyIssued: boolean }
  | { status: "error"; message: string };

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>({ status: "idle" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState({ status: "loading" });

    try {
      const res = await fetch("/api/issue-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await res.json()) as { code?: string; error?: string };

      if (res.status === 201) {
        setState({ status: "success", code: data.code!, alreadyIssued: false });
      } else if (res.status === 200 && data.code) {
        setState({ status: "success", code: data.code, alreadyIssued: true });
      } else {
        setState({ status: "error", message: data.error ?? "오류가 발생했습니다." });
      }
    } catch {
      setState({ status: "error", message: "네트워크 오류가 발생했습니다. 다시 시도해주세요." });
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            라이브 참여 코드 발급
          </h1>
          <p className="mb-8 text-sm text-gray-500">
            가입 시 사용한 이메일을 입력하시면 코드를 발급해 드립니다.
          </p>

          {state.status !== "success" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {state.status === "error" && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  {state.message}
                </p>
              )}

              <button
                type="submit"
                disabled={state.status === "loading"}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {state.status === "loading" ? "확인 중..." : "코드 발급받기"}
              </button>
            </form>
          )}

          {state.status === "success" && (
            <div className="space-y-4">
              <div className="rounded-lg bg-green-50 px-4 py-3">
                <p className="mb-1 text-sm text-green-700">
                  {state.alreadyIssued
                    ? "이미 발급된 코드입니다."
                    : "코드가 발급되었습니다!"}
                </p>
                <p className="font-mono text-2xl font-bold tracking-widest text-green-900">
                  {state.code}
                </p>
              </div>
              <p className="text-xs text-gray-400">
                이 코드를 안전한 곳에 저장해 두세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
