import { describe, expect, it } from 'vitest';
import { objectsHaveSameKeys } from './objectsHaveSameKeys';

describe('objectsHaveSameKeys', () => {
  it('should return true if objects have same keys', () => {
    const obj1 = {
      a: 1,
      b: 2,
    };
    const obj2 = {
      a: 3,
      b: 4,
    };
    expect(objectsHaveSameKeys(obj1, obj2)).toBe(true);
  });

  it('should return false if objects have different keys', () => {
    const obj1 = {
      a: 1,
      b: 2,
    };
    const obj2 = {
      a: 3,
      c: 4,
    };
    expect(objectsHaveSameKeys(obj1, obj2)).toBe(false);
  });
});
