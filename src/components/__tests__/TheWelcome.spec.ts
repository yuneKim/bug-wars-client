import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TheWelcome from '../TheWelcome.vue'

describe('TheWelcome.vue', () => {
  it('renders welcome', () => {
    const wrapper = shallowMount(TheWelcome);
    expect(wrapper.text()).toBe("Welcome")
  })
})