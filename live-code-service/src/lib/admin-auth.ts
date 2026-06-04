export const ADMIN_COOKIE = "admin_session";

// Web Crypto API — works in both Edge (middleware) and Node.js 18+ (API routes)
export async function getAdminToken(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD ?? "";
  const data = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}
