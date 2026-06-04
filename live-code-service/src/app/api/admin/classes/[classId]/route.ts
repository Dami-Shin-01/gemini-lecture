import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ classId: string }> };

export async function PATCH(req: NextRequest, ctx: Context) {
  const { classId } = await ctx.params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });
  }

  const db = getDb();
  const ref = db.collection("classes").doc(classId);
  const snap = await ref.get();
  if (!snap.exists) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const prev = snap.data()!;
  const updates: Record<string, unknown> = {};

  // 세션 토글
  if (typeof body.isActive === "boolean") {
    updates.isActive = body.isActive;
    if (body.isActive && !prev.startedAt) {
      updates.startedAt = new Date();
    }
    if (!body.isActive && prev.isActive) {
      updates.endedAt = new Date();
    }
    // 재시작 시 endedAt 초기화
    if (body.isActive && prev.endedAt) {
      updates.endedAt = FieldValue.delete();
    }
  }

  // 수량 한도 (null = 무제한)
  if ("maxCodes" in body) {
    updates.maxCodes =
      body.maxCodes === null || body.maxCodes === undefined
        ? FieldValue.delete()
        : Number(body.maxCodes);
  }

  // 강의 예정 시각
  if ("scheduledAt" in body) {
    updates.scheduledAt = body.scheduledAt
      ? new Date(body.scheduledAt as string)
      : FieldValue.delete();
  }

  // 운영자 연락처
  if ("instructorContact" in body) {
    updates.instructorContact =
      body.instructorContact || FieldValue.delete();
  }

  await ref.update(updates);
  return NextResponse.json({ ok: true });
}
