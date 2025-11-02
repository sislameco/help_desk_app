import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  imports: [],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dropdown {
  heading = input<string>('');
  isCollapsed = model<boolean>(false);

  toggleCollapse() {
    this.isCollapsed.update((val) => !val);
  }
}
