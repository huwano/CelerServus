import { describe, expect, it } from 'vitest'
import { calculateChange, calculateDraftTotals, finalizeDraftTotals, formatCents } from './checkout'

describe('checkout helpers', () => {
  it('calculates draft totals with item and deposit amounts in cents', () => {
    const rawTotals = calculateDraftTotals(
      [
        { catalogItemKey: 'wasser', quantity: 2 },
        { catalogItemKey: 'riesling-schorle', quantity: 1 },
      ],
      {
        wasser: { priceCents: 290, depositCents: 200 },
        'riesling-schorle': { priceCents: 490, depositCents: 200 },
      },
    )

    expect(finalizeDraftTotals(rawTotals)).toEqual({
      itemsCents: 1070,
      depositCents: 600,
      quantity: 3,
      totalCents: 1670,
    })
  })

  it('computes due and change for paid amounts', () => {
    expect(calculateChange(1670, 2000)).toEqual({ dueCents: 0, changeCents: 330 })
    expect(calculateChange(1670, 1000)).toEqual({ dueCents: 670, changeCents: 0 })
  })

  it('formats cents as EUR labels', () => {
    expect(formatCents(1670)).toBe('16,70 EUR')
    expect(formatCents(-330)).toBe('-3,30 EUR')
  })
})

