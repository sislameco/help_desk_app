import { Directive, effect, HostBinding, HostListener, inject, input, output } from '@angular/core';
import { SortTableDirective } from '@shared/helper/directives/sort-table/sort-table.directive';
import { EnumSortBy } from '@shared/enums/sort-by.enum';
import { SortAction } from '@shared/helper/directives/sort-table/sort-table.model';

@Directive({
  selector: '[appSortInputDirective]',
})
export class SortInputDirective {
  // ✅ signal-based inputs
  sortInput = input<number | string>('');
  isDefault = input<boolean>();
  sortColumn = input<string | number | number[] | boolean | undefined>('');
  sortBy = input<string | number | number[] | boolean | undefined>('');

  // ✅ signal-based output
  appSortChange = output<SortAction>();

  // ✅ Host bindings
  @HostBinding('class.sortable') isSortable = false;
  @HostBinding('class.descending') isDescending: boolean | null = false;
  @HostBinding('class.ascending') isAscending: boolean | null = null;

  // ✅ Inject parent directive
  private sortTableDirective = inject(SortTableDirective);

  constructor() {
    // ✅ React to input changes without ngOnChanges
    effect(() => {
      const inputVal = this.sortInput();
      const sortCol = this.sortColumn();
      const sortDir = this.sortBy();
      const defaultVal = this.isDefault();
      this.isSortable = !!(sortCol && inputVal);

      if (!sortCol || !inputVal) {
        if (defaultVal) {
          this.descendingSort();
        } else {
          this.disableSorting();
        }
        return;
      }

      if (String(sortCol) === String(inputVal)) {
        switch (sortDir) {
          case EnumSortBy.ASC:
            this.ascendingSort();
            break;
          case EnumSortBy.DESC:
            this.descendingSort();
            break;
        }
      } else {
        this.disableSorting();
      }
    });
  }

  @HostListener('click')
  onClick() {
    this.isDescending = !this.isDescending;
    this.isAscending = !this.isAscending;

    this.sortTableDirective.appSortChange.emit({
      key: String(this.sortInput()),
      isDescending: this.isDescending,
      isAscending: this.isAscending,
    });
  }

  private ascendingSort(): void {
    this.isAscending = true;
    this.isDescending = false;
  }

  private descendingSort(): void {
    this.isAscending = false;
    this.isDescending = true;
  }

  private disableSorting(): void {
    this.isAscending = null;
    this.isDescending = null;
  }
}
