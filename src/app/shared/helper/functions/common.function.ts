/**
 * Normalize a value (string, array, etc.) into an array of numbers.
 * Examples:
 *  - "1,2, 3" -> [1,2,3]
 *  - ["1", "2,3"] -> [1,2,3]
 *  - [1, 2] -> [1,2]
 *  - undefined | null | '' -> undefined
 */
export function toNums(v: unknown): number[] | undefined {
  if (v === undefined || v === null || v === '') {
    return undefined;
  }
  const parts = Array.isArray(v) ? v.flatMap((x) => String(x).split(',')) : String(v).split(',');
  const arr = parts.map((p) => Number(p.trim())).filter((n) => !Number.isNaN(n));
  return arr.length ? arr : undefined;
}

export function lowercaseFirstLetter(value: string): string {
  if (!value) {
    return value;
  }
  return value.charAt(0).toLowerCase() + value.slice(1);
}
