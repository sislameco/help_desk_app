// ✅ Type-safe version without 'any'
export function enumToArray<T extends Record<string, string | number>>(
  enumObj: T,
): { key: string; value: T[keyof T] }[] {
  return Object.keys(enumObj)
    .filter((key) => isNaN(Number(key))) // remove reverse numeric keys
    .map((key) => ({
      key,
      value: enumObj[key as keyof T],
    }));
}
