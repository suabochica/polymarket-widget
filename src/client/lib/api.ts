import type { Market } from "../../shared/types.ts"

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data as T;
}

export const api = {
  markets: (limit = 60) => req<{ markets: Market[] }>(`/api/markets?limit=${limit}`).then((r) => r.markets),
}
