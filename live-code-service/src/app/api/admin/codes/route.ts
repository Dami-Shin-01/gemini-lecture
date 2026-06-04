import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

function toIso(ts: FirebaseFirestore.Timestamp | undefined): string | null {
  return ts?.toDate?.()?.toISOString() ?? null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const classId = searchParams.get("classId") ?? undefined;
  const format = searchParams.get("format");

  const db = getDb();
  let query: FirebaseFirestore.Query = db.collection("issued_codes");
  if (classId) query = query.where("classId", "==", classId);

  const snap = await query.limit(1000).get();

  const codes = snap.docs
    .map((doc) => {
      const d = doc.data();
      return {
        email: doc.id,
        classId: d.classId as string,
        code: d.code as string,
        issuedAt: toIso(d.issuedAt) ?? "",
        isUsed: d.isUsed as boolean,
        isRevoked: (d.isRevoked as boolean) ?? false,
      };
    })
    .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));

  // CSV 다운로드 (FR-04-05)
  if (format === "csv") {
    const rows = [
      "이메일,반ID,코드,발급시각,사용여부,무효여부",
      ...codes.map(
        (c) =>
          `${c.email},${c.classId},${c.code},${c.issuedAt},${c.isUsed ? "사용됨" : "미사용"},${c.isRevoked ? "무효" : "정상"}`,
      ),
    ].join("\r\n");

    const bom = "﻿"; // 한글 Excel 호환
    return new NextResponse(bom + rows, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="codes_${classId ?? "all"}_${Date.now()}.csv"`,
      },
    });
  }

  return NextResponse.json({ codes });
}
