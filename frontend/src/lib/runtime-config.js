export function resolveApiUrl(env = import.meta.env) {
  if (env.VITE_API_URL) {
    return env.VITE_API_URL
  }

  return `http://localhost:${env.VITE_BACKEND_PORT || '3000'}`
}
