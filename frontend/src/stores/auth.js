import { defineStore } from 'pinia'
import { api, getErrorMessage, unwrapData } from './api'

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
        const payload = await api('/sessions/me')
        this.user = unwrapData(payload).user
      } catch (error) {
        if (error.status !== 401) {
          throw error
        }

        this.user = null
      } finally {
        this.loaded = true
      }
    },

    async login(username, password) {
      const payload = await api('/sessions', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })

      this.user = unwrapData(payload).user
      this.loaded = true
      return this.user
    },

    async logout() {
      try {
        await api('/sessions/current', {
          method: 'DELETE',
        })
      } catch (error) {
        if (error.status !== 401) {
          throw new Error(getErrorMessage(error, 'Logout fehlgeschlagen'))
        }
      }

      this.user = null
      this.loaded = true
    },
  },
})
