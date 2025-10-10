import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumToString',
  standalone: true,
})
export class EnumToStringPipe implements PipeTransform {
  transform<T extends Record<string | number, string | number>>(
    value: string | number | null | undefined,
    enumType: T,
  ): string {
    if (value == null || !enumType) {
      return 'Unknown';
    }

    // Handle numeric enum reverse lookup
    if (typeof value === 'number' && value in enumType) {
      return String(enumType[value as keyof T]);
    }

    // Handle string enum (forward lookup)
    const key = Object.keys(enumType).find((k) => enumType[k as keyof T] === value);

    return key ?? 'Unknown';
  }
}
