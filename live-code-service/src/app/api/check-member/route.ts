import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import { checkRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "TOO_MANY_REQUESTS" }, { status: 429 });
  }

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
    // members 문서 ID = 이메일 (소문자) — EC-N14
    const memberDoc = await db.collection("members").doc(email).get();
    if (!memberDoc.exists) {
      return NextResponse.json({ error: "MEMBER_NOT_FOUND" }, { status: 404 });
    }

    const classId = memberDoc.data()?.classId as string | undefined;
    if (!classId) {
      // EC-N01: classId 필드 누락
      return NextResponse.json(
        { error: "CLASS_NOT_ASSIGNED" },
        { status: 404 },
      );
    }

    const classDoc = await db.collection("classes").doc(classId).get();
    if (!classDoc.exists) {
      // EC-N02: classId는 있으나 classes 문서 없음
      return NextResponse.json(
        { error: "CLASS_NOT_ASSIGNED" },
        { status: 404 },
      );
    }

    const cls = classDoc.data()!;
    return NextResponse.json({
      classId,
      className: cls.name as string,
      scheduledAt: (cls.scheduledAt?.toDate?.() as Date | undefined)?.toISOString() ?? null,
      isActive: cls.isActive as boolean,
      contact: (cls.instructorContact as string | undefined) ?? null,
    });
  } catch (err) {
    console.error("[check-member]", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
