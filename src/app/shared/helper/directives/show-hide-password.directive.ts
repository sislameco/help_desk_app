import { Directive, HostBinding, signal } from '@angular/core';

@Directive({
  selector: 'input[appShowHidePassword]',
  standalone: true,
  exportAs: 'appShowHidePassword',
})
export class ShowHidePasswordDirective {
  private readonly shown = signal(false);

  @HostBinding('attr.type')
  get type(): 'text' | 'password' {
    return this.shown() ? 'text' : 'password';
  }

  toggle(): void {
    this.shown.update((v) => !v);
  }

  show(): void {
    this.shown.set(true);
  }

  hide(): void {
    this.shown.set(false);
  }

  isShown(): boolean {
    return this.shown();
  }
}
