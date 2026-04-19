import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AdminView from './AdminView.vue'

const { apiMock, subscribeToOrderChangesMock } = vi.hoisted(() => ({
  apiMock: vi.fn(),
  subscribeToOrderChangesMock: vi.fn(),
}))

vi.mock('@/stores/api', async (importOriginal) => {
  const actual = await importOriginal()

  return {
    ...actual,
    api: apiMock,
  }
})

vi.mock('@/realtime/orders', () => ({
  subscribeToOrderChanges: subscribeToOrderChangesMock,
}))

async function flushPromises() {
  await Promise.resolve()
  await Promise.resolve()
}

describe('AdminView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    apiMock.mockReset()
    subscribeToOrderChangesMock.mockReset()
    subscribeToOrderChangesMock.mockReturnValue(() => {})
  })

  it('loads the stats overview and renders aggregated admin metrics', async () => {
    apiMock.mockImplementation((path) => {
      if (path === '/catalog') {
        return Promise.resolve({
          data: {
            categories: [
              { key: 'drink', label: 'Getränke' },
              { key: 'food', label: 'Speisen' },
            ],
            items: [],
          },
        })
      }

      if (path === '/stats/overview') {
        return Promise.resolve({
          data: {
            ordersByStatus: {
              open: 2,
              in_progress: 1,
              completed: 4,
              cancelled: 1,
            },
            itemsByCategory: {
              drink: { lineCount: 3, quantityTotal: 7 },
              food: { lineCount: 2, quantityTotal: 5 },
            },
            activeItemsByStation: {
              theke: 3,
              kueche: 2,
            },
            usersByRole: {
              bedienung: 6,
              admin: 1,
            },
            totalUsers: 9,
            totalMessages: 4,
            busyTables: 3,
          },
        })
      }

      return Promise.reject(new Error(`Unexpected API path: ${path}`))
    })

    const wrapper = mount(AdminView, {
      global: {
        plugins: [createPinia()],
      },
    })

    await flushPromises()

    expect(apiMock).toHaveBeenCalledWith('/catalog')
    expect(apiMock).toHaveBeenCalledWith('/stats/overview')
    expect(wrapper.text()).toContain('Betriebsübersicht')
    expect(wrapper.text()).toContain('Order-Status')
    expect(wrapper.text()).toContain('Katalog-Nutzung')
    expect(wrapper.text()).toContain('Getränke')
    expect(wrapper.text()).toContain('7 Artikel')
    expect(wrapper.text()).toContain('8 gesamt')
    expect(wrapper.text()).toContain('6 Bedienungen aktiv geplant')
  })

  it('shows an error state when the overview request fails', async () => {
    apiMock.mockImplementation((path) => {
      if (path === '/catalog') {
        return Promise.resolve({
          data: {
            categories: [],
            items: [],
          },
        })
      }

      if (path === '/stats/overview') {
        return Promise.reject(new Error('Statistik nicht erreichbar'))
      }

      return Promise.reject(new Error(`Unexpected API path: ${path}`))
    })

    const wrapper = mount(AdminView, {
      global: {
        plugins: [createPinia()],
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Statistik nicht erreichbar')
  })
})
