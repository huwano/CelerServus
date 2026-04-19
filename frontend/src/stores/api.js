import { resolveApiUrl } from '@/lib/runtime-config'

export const API_URL = resolveApiUrl()

export async function api(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const error = new Error(data?.error?.message || 'Request failed')
    error.status = res.status
    error.payload = data
    throw error
  }

  return data
}

export function unwrapData(payload) {
  return payload?.data ?? payload
}

export function getErrorMessage(error, fallback = 'Etwas ist schiefgelaufen') {
  return error?.payload?.error?.message || error?.message || fallback
}
