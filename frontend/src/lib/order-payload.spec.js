import { describe, expect, it } from 'vitest'
import { buildOrderPayload } from './order-payload'

describe('buildOrderPayload', () => {
  it('preserves the catalog item key when building the backend payload', () => {
    const payload = buildOrderPayload({
      tableNumber: '12',
      initialNote: 'Bitte schnell',
      draftItems: [
        {
          catalogItemKey: 'apfelschorle',
          category: 'drink',
          name: 'Apfelschorle',
          quantity: 2,
        },
      ],
    })

    expect(payload.items).toEqual([
      {
        catalogItemKey: 'apfelschorle',
        category: 'drink',
        name: 'Apfelschorle',
        quantity: 2,
      },
    ])
  })
})
