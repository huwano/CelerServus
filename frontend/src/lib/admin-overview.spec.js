import { describe, expect, it } from 'vitest'
import { buildAdminOverviewMetrics } from './admin-overview'

describe('buildAdminOverviewMetrics', () => {
  it('derives the admin dashboard metrics from the backend overview payload', () => {
    const metrics = buildAdminOverviewMetrics({
      ordersByStatus: {
        open: 3,
        in_progress: 2,
        completed: 4,
        cancelled: 1,
      },
      activeItemsByStation: {
        theke: 5,
        kueche: 2,
      },
      usersByRole: {
        bedienung: 6,
        admin: 1,
      },
      busyTables: 4,
      totalUsers: 9,
      totalMessages: 7,
    })

    expect(metrics).toEqual({
      totalOrders: 10,
      activeOrders: 5,
      completedOrders: 4,
      busyTables: 4,
      totalUsers: 9,
      totalMessages: 7,
      activeBarItems: 5,
      activeKitchenItems: 2,
      waiterCount: 6,
    })
  })

  it('falls back to zero when counts are missing', () => {
    expect(buildAdminOverviewMetrics()).toEqual({
      totalOrders: 0,
      activeOrders: 0,
      completedOrders: 0,
      busyTables: 0,
      totalUsers: 0,
      totalMessages: 0,
      activeBarItems: 0,
      activeKitchenItems: 0,
      waiterCount: 0,
    })
  })
})
