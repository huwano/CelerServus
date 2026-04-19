import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CatalogItemGrid from './CatalogItemGrid.vue'

describe('CatalogItemGrid', () => {
  it('renders items and marks the selected one', () => {
    const wrapper = mount(CatalogItemGrid, {
      props: {
        items: [
          { key: 'wasser', label: 'Wasser' },
          { key: 'sekt', label: 'Sekt' },
        ],
        modelValue: 'sekt',
      },
    })

    expect(wrapper.text()).toContain('Wasser')
    expect(wrapper.text()).toContain('Sekt')
    expect(wrapper.find('.catalog-item-grid__item--selected').text()).toContain('Sekt')
  })

  it('emits the selected item key on tap', async () => {
    const wrapper = mount(CatalogItemGrid, {
      props: {
        items: [{ key: 'wasser', label: 'Wasser' }],
      },
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['wasser']])
  })
})
