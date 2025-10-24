import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true,
})
export class CustomDatePipe implements PipeTransform {
  private readonly datePipe = new DatePipe('en-US');

  transform(value: Date | string | number): string | null {
    return this.datePipe.transform(value, 'd MMMM yyyy hh:mm a');
  }
}
