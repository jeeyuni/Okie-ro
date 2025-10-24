const ANON_ID_KEY = "anon_id";

export function getUserId(): string {
  if (typeof window === "undefined") return "";

  let anonId = localStorage.getItem(ANON_ID_KEY);

  if (!anonId) {
    // 새로운 익명 ID 생성
    anonId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(ANON_ID_KEY, anonId);
  }

  return anonId;
}

export function clearUserId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ANON_ID_KEY);
}
