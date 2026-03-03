const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export async function apiFetch(path: string, options?: RequestInit) {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {})
    }
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "API error" }));
    throw new Error(error.error || "API error");
  }

  return res.json();
}
