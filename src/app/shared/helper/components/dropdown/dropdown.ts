import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  imports: [],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dropdown {
  heading = input<string>('');
  isCollapsed = signal(false);

  toggleCollapse() {
    this.isCollapsed.update((val) => !val);
  }
}
