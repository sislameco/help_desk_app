import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform<T>(values: T[], args?: string): T[] {
    if (!values) {
      return [];
    }
    if (!args) {
      return values;
    }

    args = args?.toLowerCase();

    return values.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(args);
    });
  }
}
