import { Directive, ElementRef, inject, output } from '@angular/core';
import { SortAction } from '@shared/helper/directives/sort-table/sort-table.model';

@Directive({
  selector: '[appSortTableDirective]',
})
export class SortTableDirective {
  readonly appSortChange = output<SortAction>();

  private readonly el = inject(ElementRef);

  constructor() {
    this.el.nativeElement.classList.add('cursor-pointer');
  }
}
