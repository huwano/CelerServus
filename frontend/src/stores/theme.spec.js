import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { DEFAULT_THEME, THEME_STORAGE_KEY, useThemeStore } from './theme'

describe('theme store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    document.documentElement.removeAttribute('data-theme')
    window.localStorage.clear()
  })

  it('initializes with the default dark theme when nothing is stored', () => {
    const theme = useThemeStore()

    theme.initialize()

    expect(theme.theme).toBe(DEFAULT_THEME)
    expect(theme.isDark).toBe(true)
    expect(document.documentElement.dataset.theme).toBe(DEFAULT_THEME)
  })

  it('restores a stored light theme and persists explicit changes', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light')
    const theme = useThemeStore()

    theme.initialize()
    expect(theme.isLight).toBe(true)
    expect(document.documentElement.dataset.theme).toBe('light')

    theme.setTheme('dark')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('toggles between dark and light themes', () => {
    const theme = useThemeStore()

    theme.initialize()
    theme.toggleTheme()
    expect(theme.theme).toBe('light')

    theme.toggleTheme()
    expect(theme.theme).toBe('dark')
  })
})
