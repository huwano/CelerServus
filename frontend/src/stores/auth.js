import { defineStore } from 'pinia'

const API = 'http://localhost:3000'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loaded: false, // damit der Guard weiß, ob /me schon versucht wurde
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    role: (state) => state.user?.role || null,
  },
  actions: {
    async fetchMe() {
      try {
        const res = await fetch(`${API}/api/me`, {
          credentials: 'include',
        })
        const data = await res.json()
        this.user = res.ok ? data.user : null
      } finally {
        this.loaded = true
      }
    },

    async login(username, password) {
      const res = await fetch(`${API}/api/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) throw data
      this.user = data.user
      this.loaded = true
      return data.user
    },

    async logout() {
      await fetch(`${API}/api/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      this.user = null
      this.loaded = true
    },
  },
})
