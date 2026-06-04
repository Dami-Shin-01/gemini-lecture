import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase-admin";
import { generateCode } from "@/lib/codeGenerator";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type TxResult =
  | { kind: "new"; code: string }
  | { kind: "existing"; code: string }
  | { kind: "quota" };

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_EMAIL" }, { status: 400 });
  }

  const raw = (body as Record<string, unknown>)?.email;
  if (!raw || typeof raw !== "string" || !EMAIL_RE.test(raw.trim())) {
    return NextResponse.json({ error: "INVALID_EMAIL" }, { status: 400 });
  }

  const email = raw.toLowerCase().trim();

  try {
    const db = getDb();
    // classId는 항상 서버에서 members 문서로 결정 — 클라이언트 입력 무시 (EC-N08)
    const memberDoc = await db.collection("members").doc(email).get();
    if (!memberDoc.exists) {
      return NextResponse.json({ error: "MEMBER_NOT_FOUND" }, { status: 404 });
    }

    const classId = memberDoc.data()?.classId as string | undefined;
    if (!classId) {
      return NextResponse.json({ error: "CLASS_NOT_ASSIGNED" }, { status: 404 });
    }

    const classDoc = await db.collection("classes").doc(classId).get();
    if (!classDoc.exists) {
      return NextResponse.json({ error: "CLASS_NOT_ASSIGNED" }, { status: 404 });
    }

    const cls = classDoc.data()!;
    const className = cls.name as string;
    const contact = (cls.instructorContact as string | undefined) ?? null;
    const maxCodes = cls.maxCodes as number | undefined;

    const codeRef = db.collection("issued_codes").doc(email);
    const metaRef = db.collection("issued_codes_meta").doc(classId);

    // 기발급 확인을 세션 활성 확인보다 먼저 수행 (FR-02-03, EC-09)
    const existingDoc = await codeRef.get();
    if (existingDoc.exists) {
      return NextResponse.json(
        {
          code: existingDoc.data()!.code as string,
          classId,
          className,
          contact,
          alreadyIssued: true,
        },
        { status: 200 },
      );
    }

    // 세션 활성 확인
    if (!(cls.isActive as boolean)) {
      const kind = cls.endedAt ? "SESSION_ENDED" : "SESSION_NOT_STARTED";
      return NextResponse.json({ error: kind, className, contact }, { status: 403 });
    }

    // 수량 pre-check (race condition 방어는 트랜잭션 내부에서 추가 처리)
    if (maxCodes !== undefined) {
      const metaDoc = await metaRef.get();
      const total = (metaDoc.data()?.total as number) ?? 0;
      if (total >= maxCodes) {
        return NextResponse.json(
          { error: "QUOTA_EXCEEDED", className, contact },
          { status: 403 },
        );
      }
    }

    // 트랜잭션으로 1인 1코드 보장 (FR-02-06)
    const result: TxResult = await db.runTransaction(async (tx) => {
      const existing = await tx.get(codeRef);
      if (existing.exists) {
        return { kind: "existing", code: existing.data()!.code as string };
      }

      if (maxCodes !== undefined) {
        const meta = await tx.get(metaRef);
        const total = (meta.data()?.total as number) ?? 0;
        if (total >= maxCodes) return { kind: "quota" };
        tx.set(metaRef, { total: FieldValue.increment(1) }, { merge: true });
      }

      const newCode = generateCode();
      tx.set(codeRef, {
        email,
        classId,
        code: newCode,
        issuedAt: new Date(),
        isUsed: false,
        isRevoked: false,
      });
      return { kind: "new", code: newCode };
    });

    if (result.kind === "quota") {
      return NextResponse.json(
        { error: "QUOTA_EXCEEDED", className, contact },
        { status: 403 },
      );
    }

    return NextResponse.json(
      { code: result.code, classId, className, contact, alreadyIssued: result.kind === "existing" },
      { status: result.kind === "new" ? 201 : 200 },
    );
  } catch (err) {
    console.error("[issue-code]", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
