import { Pipe, PipeTransform } from '@angular/core';
import { EnumDataSource } from '../../../../features/company-configuration/models/company.model';

@Pipe({
  name: 'enumToString',
  standalone: true, // ✅ if using Angular 15+ standalone
})
export class EnumToStringPipe implements PipeTransform {
  transform(value: number): string {
    return EnumDataSource[value] ?? 'Unknown';
  }
}
