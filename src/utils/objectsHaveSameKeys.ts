export function objectsHaveSameKeys(...objects: Record<string, unknown>[]) {
  const allKeys = objects.reduce<string[]>((keys, object) => keys.concat(Object.keys(object)), []);
  const union = new Set(allKeys);
  return objects.every((object) => union.size === Object.keys(object).length);
}
