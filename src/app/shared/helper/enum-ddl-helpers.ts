import { EnumPriority } from '../../features/company-configuration/models/sla.model';

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

/** ✅ Add this function */
export function getPriorityColor(priority: EnumPriority): string {
  switch (priority) {
    case EnumPriority.Highest:
      return 'danger'; // red
    case EnumPriority.High:
      return 'warning'; // yellow
    case EnumPriority.Medium:
      return 'info'; // blue
    case EnumPriority.Low:
      return 'secondary'; // gray
    default:
      return 'light';
  }
}
