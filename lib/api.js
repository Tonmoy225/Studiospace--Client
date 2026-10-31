// All calls to the Express server go through here.
// /api/server/* is proxied to Express by next.config.mjs
export async function api(path, options = {}, retried = false) {
  const res = await fetch(`/api/server${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  // JWT cookie missing/expired but BetterAuth session alive -> issue JWT cookie, retry once
  if (res.status === 401 && !retried) {
    const jwtRes = await fetch("/api/jwt", { method: "POST" });
    if (jwtRes.ok) return api(path, options, true);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}
