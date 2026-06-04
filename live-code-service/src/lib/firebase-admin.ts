import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// 빌드 시 모듈 임포트 시점이 아닌, 핸들러 실행 시점에 초기화 (지연 초기화)
let _db: Firestore | undefined;

export function getDb(): Firestore {
  if (_db) return _db;
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
  _db = getFirestore();
  return _db;
}
