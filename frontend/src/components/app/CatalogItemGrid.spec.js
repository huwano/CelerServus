import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CatalogItemGrid from './CatalogItemGrid.vue'

describe('CatalogItemGrid', () => {
  it('renders items and marks the selected one', () => {
    const wrapper = mount(CatalogItemGrid, {
      props: {
        items: [
          { key: 'wasser', label: 'Wasser', priceLabel: '2,90 EUR' },
          { key: 'sekt', label: 'Sekt', shortLabel: 'Sekt 0,1l', priceLabel: '5,40 EUR' },
        ],
        modelValue: 'sekt',
      },
    })

    expect(wrapper.text()).toContain('Wasser')
    expect(wrapper.text()).toContain('Sekt 0,1l')
    expect(wrapper.text()).toContain('5,40 EUR')
    expect(wrapper.find('.catalog-item-grid__item--selected').text()).toContain('Sekt 0,1l')
  })

  it('emits selection and direct tap event on tap', async () => {
    const wrapper = mount(CatalogItemGrid, {
      props: {
        items: [{ key: 'wasser', label: 'Wasser' }],
      },
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['wasser']])
    expect(wrapper.emitted('item-tap')).toEqual([['wasser']])
  })
})
