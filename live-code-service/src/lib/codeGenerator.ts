// 헷갈리기 쉬운 문자(0, O, I, 1, L) 제외
const CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateCode(): string {
  let suffix = "";
  for (let i = 0; i < 8; i++) {
    suffix += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return `LIVE-${suffix}`;
}
