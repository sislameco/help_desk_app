// Generic helper to convert Enum to array of { key, value }
export function enumToArray<T extends object>(enumObj: T): { key: string; value: any }[] {
  return Object.keys(enumObj)
    .filter((key) => isNaN(Number(key))) // remove reverse numeric keys
    .map((key) => ({
      key,
      value: (enumObj as Record<string, unknown>)[key],
    }));
}
