import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

function toIso(ts: FirebaseFirestore.Timestamp | undefined): string | null {
  return ts?.toDate?.()?.toISOString() ?? null;
}

export async function GET() {
  const db = getDb();

  // classes와 issued_codes_meta를 병렬로 조회
  const [classSnap, metaSnap] = await Promise.all([
    db.collection("classes").orderBy("__name__").get(),
    db.collection("issued_codes_meta").get(),
  ]);

  const metaMap = new Map<string, number>();
  metaSnap.docs.forEach((d) => {
    metaMap.set(d.id, (d.data().total as number) ?? 0);
  });

  const classes = classSnap.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      name: d.name as string,
      scheduledAt: toIso(d.scheduledAt),
      isActive: d.isActive as boolean,
      maxCodes: (d.maxCodes as number | undefined) ?? null,
      instructorContact: (d.instructorContact as string | undefined) ?? null,
      startedAt: toIso(d.startedAt),
      endedAt: toIso(d.endedAt),
      issuedCount: metaMap.get(doc.id) ?? 0,
    };
  });

  return NextResponse.json({ classes });
}
