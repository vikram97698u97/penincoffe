// src/lib/firebaseSSG.ts
// Lightweight HTTP fetcher for Next.js build-time SSG generation without opening WebSocket connections that hang Node.js processes.

export async function getFirebasePostsForSSG(): Promise<any[]> {
  try {
    const dbUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://penincoffe-default-rtdb.asia-southeast1.firebasedatabase.app";
    const res = await fetch(`${dbUrl}/posts.json`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data) return [];
    return Object.values(data);
  } catch (err) {
    console.warn("SSG fetch error:", err);
    return [];
  }
}
