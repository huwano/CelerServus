import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCatalogStore } from './catalog'

const apiMock = vi.fn()

vi.mock('./api', () => ({
  api: (...args) => apiMock(...args),
  getErrorMessage: (error, fallback) => error?.message || fallback,
  unwrapData: (payload) => payload?.data ?? payload,
}))

describe('catalog store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    apiMock.mockReset()
  })

  it('exposes default category options from config', () => {
    const catalog = useCatalogStore()

    expect(catalog.categoryOptions).toEqual([
      { value: 'drink', label: 'Getränk' },
      { value: 'food', label: 'Speise' },
    ])
    expect(catalog.defaultCategoryKey).toBe('drink')
  })

  it('can replace category definitions for future admin-driven config', () => {
    const catalog = useCatalogStore()

    catalog.setCategories([
      { key: 'wine', label: 'Wein', station: 'theke' },
      { key: 'snack', label: 'Snack', station: 'kueche' },
    ])

    expect(catalog.categoryOptions).toEqual([
      { value: 'wine', label: 'Wein' },
      { value: 'snack', label: 'Snack' },
    ])
    expect(catalog.getCategoryLabel('wine')).toBe('Wein')
    expect(catalog.hasCategory('food')).toBe(false)
  })

  it('filters catalog items by category and optional search', () => {
    const catalog = useCatalogStore()

    const drinkItems = catalog.getItemsForWaiter('drink')
    const wineItems = catalog.getItemsForWaiter('drink', 'wein')

    expect(drinkItems.length).toBeGreaterThan(0)
    expect(drinkItems.every((item) => item.category === 'drink')).toBe(true)
    expect(wineItems.map((item) => item.key)).toContain('riesling-schorle')
    expect(wineItems.every((item) => item.category === 'drink')).toBe(true)
  })

  it('hydrates catalog data from the backend endpoint', async () => {
    const catalog = useCatalogStore()
    apiMock.mockResolvedValue({
      data: {
        categories: [{ key: 'wine', label: 'Wein', station: 'theke' }],
        items: [{ key: 'riesling', label: 'Riesling', category: 'wine', searchTerms: [] }],
      },
    })

    await catalog.fetchCatalog()

    expect(apiMock).toHaveBeenCalledWith('/catalog')
    expect(catalog.loaded).toBe(true)
    expect(catalog.categoryOptions).toEqual([{ value: 'wine', label: 'Wein' }])
    expect(catalog.getItemByKey('riesling')?.label).toBe('Riesling')
  })

  it('keeps defaults when backend loading fails', async () => {
    const catalog = useCatalogStore()
    apiMock.mockRejectedValue(new Error('kaputt'))

    await catalog.fetchCatalog()

    expect(catalog.loaded).toBe(false)
    expect(catalog.error).toBe('kaputt')
    expect(catalog.categoryOptions).toEqual([
      { value: 'drink', label: 'Getränk' },
      { value: 'food', label: 'Speise' },
    ])
  })
})
