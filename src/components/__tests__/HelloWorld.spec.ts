import { describe, expect, it } from 'vitest'

import HomeView from '@/views/HomeView.vue'
import { shallowMount } from '@vue/test-utils'
import TheWelcome from '../TheWelcome.vue'

describe('HomeView.vue', () => {
  it('renders TheWelcome component', () => {
    const wrapper = shallowMount(HomeView);
    expect(wrapper.findComponent(TheWelcome).exists()).toBe(true)
  })
})