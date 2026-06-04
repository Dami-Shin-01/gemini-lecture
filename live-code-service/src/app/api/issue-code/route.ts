import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { generateCode } from "@/lib/codeGenerator";

export async function POST(request: NextRequest) {
  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "이메일을 입력해주세요." }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // 1. 라이브 세션 활성화 여부 확인
  const sessionDoc = await db.collection("live_sessions").doc("current").get();
  if (!sessionDoc.exists || !sessionDoc.data()?.isActive) {
    return NextResponse.json(
      { error: "현재 라이브 세션이 진행 중이지 않습니다." },
      { status: 403 }
    );
  }

  // 2. 기존 가입자 확인
  const membersSnap = await db
    .collection("members")
    .where("email", "==", normalizedEmail)
    .limit(1)
    .get();
  if (membersSnap.empty) {
    return NextResponse.json(
      { error: "등록된 회원 정보가 없습니다." },
      { status: 403 }
    );
  }

  // 3 & 4. 중복 확인 + 코드 발급 (트랜잭션으로 race condition 방지)
  const codeRef = db.collection("issued_codes").doc(normalizedEmail);

  try {
    const code = await db.runTransaction(async (tx) => {
      const existing = await tx.get(codeRef);
      if (existing.exists) {
        throw Object.assign(new Error("ALREADY_ISSUED"), {
          existingCode: existing.data()!.code as string,
        });
      }
      const newCode = generateCode();
      tx.set(codeRef, {
        email: normalizedEmail,
        code: newCode,
        issuedAt: new Date(),
        isUsed: false,
      });
      return newCode;
    });

    return NextResponse.json({ code }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "ALREADY_ISSUED") {
      return NextResponse.json(
        {
          error: "이미 코드가 발급되었습니다.",
          code: (err as Error & { existingCode: string }).existingCode,
        },
        { status: 200 }
      );
    }
    console.error("코드 발급 오류:", err);
    return NextResponse.json(
      { error: "코드 발급 중 오류가 발생했습니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
