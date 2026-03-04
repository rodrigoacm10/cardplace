import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import { setupTestApp } from './test-utils'

describe('App', () => {
  it('mounts renders properly', () => {
    const wrapper = mount(App, {
      ...setupTestApp(),
      stubs: {
        RouterView: true,
        Toaster: true,
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
