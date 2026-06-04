"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        setError(true);
        setLoading(false);
      }
    } catch {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <h1 className="mb-6 text-xl font-bold text-gray-900">관리자 로그인</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className={`w-full rounded-lg border px-4 py-3 text-base outline-none transition focus:ring-2 focus:ring-blue-500/20 ${
                  error
                    ? "border-red-400 focus:border-red-400"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />
              {error && (
                <p className="mt-1.5 text-sm text-red-600">
                  비밀번호가 올바르지 않습니다.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex min-h-[48px] w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "확인 중…" : "로그인"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
