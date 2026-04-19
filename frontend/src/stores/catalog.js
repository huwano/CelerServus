import { defineStore } from 'pinia'
import { defaultCatalogConfig } from '@/config/catalog'
import { api, getErrorMessage, unwrapData } from './api'

function cloneCategories(categories) {
  return categories.map((category) => ({ ...category }))
}

function cloneItems(items) {
  return items.map((item) => ({
    ...item,
    searchTerms: Array.isArray(item.searchTerms) ? [...item.searchTerms] : [],
  }))
}

function normalizeSearch(search) {
  return search.trim().toLocaleLowerCase('de-DE')
}

export const useCatalogStore = defineStore('catalog', {
  state: () => ({
    categories: cloneCategories(defaultCatalogConfig.categories),
    items: cloneItems(defaultCatalogConfig.items),
    loaded: false,
    loading: false,
    error: '',
  }),
  getters: {
    categoryOptions: (state) =>
      state.categories.map((category) => ({
        value: category.key,
        label: category.label,
      })),
    defaultCategoryKey: (state) => state.categories[0]?.key || '',
    itemsByCategory: (state) => (categoryKey) =>
      state.items.filter((item) => item.category === categoryKey),
  },
  actions: {
    setCategories(categories) {
      this.categories = cloneCategories(categories)
    },

    setItems(items) {
      this.items = cloneItems(items)
    },

    reset() {
      this.categories = cloneCategories(defaultCatalogConfig.categories)
      this.items = cloneItems(defaultCatalogConfig.items)
      this.loaded = false
      this.loading = false
      this.error = ''
    },

    async fetchCatalog() {
      if (this.loading) {
        return
      }

      this.loading = true
      this.error = ''

      try {
        const payload = await api('/catalog')
        const catalog = unwrapData(payload)

        this.categories = cloneCategories(catalog.categories || defaultCatalogConfig.categories)
        this.items = cloneItems(catalog.items || defaultCatalogConfig.items)
        this.loaded = true
      } catch (error) {
        this.error = getErrorMessage(error, 'Katalog konnte nicht geladen werden')
      } finally {
        this.loading = false
      }
    },

    getCategoryLabel(categoryKey) {
      return this.categories.find((category) => category.key === categoryKey)?.label || categoryKey
    },

    hasCategory(categoryKey) {
      return this.categories.some((category) => category.key === categoryKey)
    },

    getItemByKey(itemKey) {
      return this.items.find((item) => item.key === itemKey) || null
    },

    getItemsForWaiter(categoryKey, search = '') {
      const normalizedSearch = normalizeSearch(search)

      return this.items.filter((item) => {
        if (item.category !== categoryKey) {
          return false
        }

        if (!normalizedSearch) {
          return true
        }

        const haystack = [item.label, ...(item.searchTerms || [])]
          .join(' ')
          .toLocaleLowerCase('de-DE')

        return haystack.includes(normalizedSearch)
      })
    },
  },
})
