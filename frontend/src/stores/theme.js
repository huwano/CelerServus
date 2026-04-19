import { defineStore } from 'pinia'

const THEME_STORAGE_KEY = 'celerservus-theme'
const DEFAULT_THEME = 'dark'

function resolveStoredTheme() {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : DEFAULT_THEME
}

function applyThemeToDocument(theme) {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.dataset.theme = theme
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: DEFAULT_THEME,
    initialized: false,
  }),
  getters: {
    isDark: (state) => state.theme === 'dark',
    isLight: (state) => state.theme === 'light',
  },
  actions: {
    initialize() {
      if (this.initialized) {
        applyThemeToDocument(this.theme)
        return
      }

      this.theme = resolveStoredTheme()
      applyThemeToDocument(this.theme)
      this.initialized = true
    },

    setTheme(theme) {
      if (theme !== 'dark' && theme !== 'light') {
        return
      }

      this.theme = theme
      applyThemeToDocument(this.theme)

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(THEME_STORAGE_KEY, this.theme)
      }
    },

    toggleTheme() {
      this.setTheme(this.theme === 'dark' ? 'light' : 'dark')
    },
  },
})

export { DEFAULT_THEME, THEME_STORAGE_KEY }
