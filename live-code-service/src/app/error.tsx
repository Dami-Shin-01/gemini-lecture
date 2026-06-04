"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">코드 받기</h1>
        <div className="rounded-xl bg-orange-50 px-5 py-4">
          <p className="mb-1 text-lg font-semibold text-orange-900">
            ⚠️ 서비스에 일시적인 문제가 생겼습니다
          </p>
          <p className="text-sm text-orange-800">
            잠시 후 아래 버튼을 눌러 다시 시도해 주세요.
          </p>
          <p className="mt-2 text-sm text-orange-700">
            계속 문제가 발생한다면 강사 선생님께 알려주세요.
          </p>
        </div>
        <button
          onClick={reset}
          className="mt-4 flex min-h-[48px] w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
        >
          다시 시도하기
        </button>
      </div>
    </main>
  );
}
