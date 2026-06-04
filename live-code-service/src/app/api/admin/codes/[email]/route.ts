import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ email: string }> };

// 코드 무효화 / 복구 (FR-04-03)
export async function PATCH(req: NextRequest, ctx: Context) {
  const { email } = await ctx.params;
  const decoded = decodeURIComponent(email);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });
  }

  const db = getDb();
  const ref = db.collection("issued_codes").doc(decoded);
  const snap = await ref.get();
  if (!snap.exists) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  await ref.update({ isRevoked: !!body.isRevoked });
  return NextResponse.json({ ok: true });
}
