// stores/counter.spec.ts
import { useCounterStore } from '@/stores/counter'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Counter Store', () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('increments', () => {
    const counter = useCounterStore()
    expect(counter.count).toBe(0)
    counter.increment()
    expect(counter.count).toBe(1)
  })

  it('returns doublecount', () => {
    const counter = useCounterStore()
    counter.increment()
    expect(counter.doubleCount).toBe(2)
    counter.increment()
    expect(counter.doubleCount).toBe(4)
  })
})