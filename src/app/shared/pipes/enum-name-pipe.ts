import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumName',
})
export class EnumNamePipe implements PipeTransform {
  transform<T extends object>(value: string | number, enumType: T): string {
    if (value === null || value === undefined) {
      return '';
    }

    // Handle numeric enums (reverse mapping)
    if (typeof value === 'number' && value in enumType) {
      return enumType[value as keyof T] as string;
    }

    // Handle string enums (manual lookup)
    const key = Object.keys(enumType).find((k) => enumType[k as keyof T] === value);

    return key ?? '';
  }
}
