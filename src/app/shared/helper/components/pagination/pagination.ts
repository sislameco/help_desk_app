import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  imports: [NgOptionComponent, NgSelectComponent, FormsModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pagination {
  // Inputs
  readonly total = input.required<number>();
  readonly page = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly pageSizeOptions = input<number[]>([10, 20, 30, 40, 50]);

  // Outputs
  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  // Computed values
  readonly totalPages = computed(
    () => Math.ceil((this.total() ?? 0) / (this.pageSize() || 1)) || 1,
  );
  readonly pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  pageNum = computed(() => Number(this.page()));

  // Handlers
  setPageSize(size: number) {
    this.pageSizeChange.emit(Number(size));
  }

  setPage(page: number) {
    const p = Math.max(1, Math.min(Number(page), this.totalPages()));
    this.pageChange.emit(p);
  }
}
