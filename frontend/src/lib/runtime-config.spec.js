import { describe, expect, it } from 'vitest'
import { resolveApiUrl } from './runtime-config'

describe('resolveApiUrl', () => {
  it('prefers VITE_API_URL when provided', () => {
    expect(resolveApiUrl({ VITE_API_URL: 'http://localhost:4010' })).toBe(
      'http://localhost:4010',
    )
  })

  it('falls back to the configured backend port', () => {
    expect(resolveApiUrl({ VITE_BACKEND_PORT: '4020' })).toBe('http://localhost:4020')
    expect(resolveApiUrl({})).toBe('http://localhost:3000')
  })
})
