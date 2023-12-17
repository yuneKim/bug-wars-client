// stores/counter.spec.ts
import { describe, expect, it } from 'vitest';
import { useCounter } from './counter';

describe('Counter Store', () => {
  it('increments', () => {
    const { count, increment } = useCounter();
    expect(count.value).toBe(0);
    increment();
    expect(count.value).toBe(1);
  });

  it('returns doublecount', () => {
    const { doubleCount, increment } = useCounter();
    increment();
    expect(doubleCount.value).toBe(2);
    increment();
    expect(doubleCount.value).toBe(4);
  });
});
