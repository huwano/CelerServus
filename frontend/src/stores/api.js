export async function api(path, options = {}) {
  const res = await fetch(`http://localhost:3000${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw data
  return data
}
