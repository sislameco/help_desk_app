import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumName',
})
export class EnumNamePipe implements PipeTransform {
  // transform<T extends object>(value: number | string, enumType: T): string {
  //   if (value === null || value === undefined || !enumType) {
  //     return '';
  //   }

  //   // For numeric enums, reverse lookup works automatically
  //   const enumKey = (enumType as any)[value];

  //   // For string enums, we need to find the key manually
  //   if (!enumKey) {
  //     const key = Object.keys(enumType).find((k) => (enumType as any)[k] === value);
  //     return key ?? '';
  //   }

  //   return enumKey;
  // }

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
