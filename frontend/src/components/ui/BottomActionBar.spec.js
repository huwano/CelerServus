import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import BottomActionBar from './BottomActionBar.vue'

describe('BottomActionBar', () => {
  it('renders meta and action slots', () => {
    const wrapper = mount(BottomActionBar, {
      slots: {
        meta: '<strong>2 Positionen bereit</strong>',
        default: '<button>Bestellung senden</button>',
      },
    })

    expect(wrapper.find('.bottom-action-bar__meta').text()).toContain('2 Positionen bereit')
    expect(wrapper.find('.bottom-action-bar__actions').text()).toContain('Bestellung senden')
  })
})
