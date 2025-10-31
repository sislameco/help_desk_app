import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  imports: [],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dropdown {
  heading = input<string>('');
  hasAddButon = input<boolean>(false);
  addTrigger = output<void>();
  isCollapsed = signal(false);

  toggleCollapse() {
    this.isCollapsed.update((val) => !val);
  }

  triggerAdd() {
    this.addTrigger.emit();
  }
}
