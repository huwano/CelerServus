import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import BaseButton from './BaseButton.vue'

describe('BaseButton', () => {
  it('renders its variant and block classes', () => {
    const wrapper = mount(BaseButton, {
      props: {
        block: true,
        variant: 'danger',
      },
      slots: {
        default: 'Entfernen',
      },
    })

    expect(wrapper.classes()).toContain('base-button--danger')
    expect(wrapper.classes()).toContain('base-button--block')
    expect(wrapper.text()).toContain('Entfernen')
  })

  it('forwards button semantics and click handling', async () => {
    const onClick = vi.fn()
    const wrapper = mount(BaseButton, {
      attrs: {
        onClick,
      },
      props: {
        type: 'submit',
      },
    })

    expect(wrapper.attributes('type')).toBe('submit')

    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
