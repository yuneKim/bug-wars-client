// stores/counter.spec.ts
import { useCounterStore } from '@/stores/counter';
import { createPinia, setActivePinia, storeToRefs } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';

describe('Counter Store', () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia());
  });

  it('increments', () => {
    const counterStore = useCounterStore();
    const { increment } = counterStore;
    const { count } = storeToRefs(counterStore);
    expect(count.value).toBe(0);
    increment();
    expect(count.value).toBe(1);
  });

  it('returns doublecount', () => {
    const counterStore = useCounterStore();
    const { increment } = counterStore;
    const { doubleCount } = storeToRefs(counterStore);
    increment();
    expect(doubleCount.value).toBe(2);
    increment();
    expect(doubleCount.value).toBe(4);
  });
});
