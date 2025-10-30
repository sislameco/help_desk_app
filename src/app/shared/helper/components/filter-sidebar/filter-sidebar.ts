import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { CollapseDirective } from 'ngx-bootstrap/collapse';

@Component({
  selector: 'app-filter-sidebar',
  imports: [CollapseDirective],
  templateUrl: './filter-sidebar.html',
  styleUrl: './filter-sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterSidebar {
  isCollapsed = signal(true);
  filterName = input<string | number>('');
  isCollapsedShow = input<boolean>(false);

  constructor() {
    effect(() => {
      if (this.isCollapsedShow()) {
        this.isCollapsed.set(false);
      }
    });
  }

  toggleCollapse() {
    this.isCollapsed.update((v) => !v);
  }
}
