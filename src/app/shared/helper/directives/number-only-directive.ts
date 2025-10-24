import { Directive, HostListener, inject, input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNumberOnly]',
})
export class NumberOnlyDirective {
  allowDecimal = input(true);
  allowNegative = input(false);
  precision = input<number>();
  limit = input<number>();
  maxValue = input<number>();
  minValue = input<number>(); // 👈 new input

  private control = inject(NgControl, { optional: true, self: true });

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent): void {
    const ALLOWED = [
      'Delete',
      'Backspace',
      'Tab',
      'Escape',
      'Enter',
      'Home',
      'End',
      'ArrowLeft',
      'ArrowRight',
    ];

    const target = event.target as HTMLInputElement;
    const value = target.value;
    const cursorPos = target.selectionStart ?? 0;
    const selectionEnd = target.selectionEnd ?? 0;
    const isFullSelection = cursorPos === 0 && selectionEnd === value.length; // 👈 check if whole text is selected

    const shouldAllowDecimal = this.allowDecimal() && !value.includes('.');
    if (shouldAllowDecimal) {
      ALLOWED.push('.');
    }

    const shouldAllowNegative = this.allowNegative() && !value.includes('-');
    if (shouldAllowNegative && cursorPos === 0) {
      ALLOWED.push('-');
    }

    if (this.allowDecimal() && !value.length && event.code === 'NumpadDecimal') {
      target.value = '0.';
      this.updateControlValue(target.value);
      event.preventDefault();
    }

    if (
      ALLOWED.includes(event.key) ||
      ((event.ctrlKey || event.metaKey) && ['KeyA', 'KeyC', 'KeyV', 'KeyX'].includes(event.code))
    ) {
      return;
    }

    if (Number.isNaN(Number(event.key)) || event.code === 'Space') {
      event.preventDefault();
    }

    const limit = this.limit();
    if (limit) {
      const values = value.split('.');
      const totalLength = values.reduce((sum, part) => sum + part.length, 0);
      if (totalLength >= limit && !isFullSelection) {
        // 👈 allow replacement when full selected
        event.preventDefault();
      }
    }

    // 👇 check maxValue/minValue before typing new number
    const maxValue = this.maxValue();
    const minValue = this.minValue();
    if ((maxValue !== undefined || minValue !== undefined) && !isNaN(+event.key)) {
      const newValue = isFullSelection
        ? event.key // 👈 replacement
        : value.substring(0, cursorPos) + event.key + value.substring(cursorPos);
      const numeric = Number(newValue);
      if (
        (maxValue !== undefined && numeric > maxValue) ||
        (minValue !== undefined && numeric < minValue)
      ) {
        event.preventDefault();
      }
    }
  }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent): void {
    const target = event.target as HTMLInputElement;
    const clipboardData = event.clipboardData?.getData('text/plain') ?? '';
    const value = target.value;

    const preventDecimal = !this.allowDecimal && clipboardData.includes('.');
    const preventNegative = !this.allowNegative && clipboardData.includes('-');
    const duplicateDecimal =
      this.allowDecimal() && clipboardData.includes('.') && value.includes('.');

    const maxValue = this.maxValue();
    const minValue = this.minValue();
    if (
      Number.isNaN(Number(clipboardData)) ||
      preventDecimal ||
      preventNegative ||
      duplicateDecimal ||
      (maxValue !== undefined && Number(clipboardData) > maxValue) ||
      (minValue !== undefined && Number(clipboardData) < minValue)
    ) {
      event.preventDefault();
    }
  }

  @HostListener('keyup', ['$event']) onKeyUp(event: KeyboardEvent): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const maxValue = this.maxValue();
    const minValue = this.minValue();

    if (event.key === 'ArrowUp') {
      if (value) {
        let next = parseFloat(value) + 1;
        if (maxValue !== undefined && next > maxValue) {
          next = maxValue;
        }
        target.value = next.toString();
        this.updateControlValue(target.value);
      }
    } else if (event.key === 'ArrowDown') {
      const currentValue = parseFloat(value);
      if (value && !(!this.allowNegative && currentValue <= 0)) {
        if (!(currentValue >= 0 && currentValue <= 1)) {
          let next = currentValue - 1;
          if (minValue !== undefined && next < minValue) {
            next = minValue;
          }
          target.value = next.toString();
          this.updateControlValue(target.value);
        }
      }
    } else if (this.allowDecimal() && value && Number.isNaN(Number(value))) {
      target.value = '0.';
      this.updateControlValue(target.value);
    }

    // 👇 enforce bounds after keyup
    const numeric = Number(value);
    if (maxValue !== undefined && numeric > maxValue) {
      target.value = maxValue.toString();
      this.updateControlValue(target.value);
    } else if (minValue !== undefined && numeric < minValue) {
      target.value = minValue.toString();
      this.updateControlValue(target.value);
    }
  }

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const precision = this.precision();

    if (this.allowDecimal() && precision) {
      const values = (target.value || '').split('.');
      if (values[1]?.length > precision) {
        values[1] = values[1].substring(0, precision);
        target.value = values.join('.');
        this.updateControlValue(target.value);
      }
    }

    // 👇 enforce bounds after input
    const maxValue = this.maxValue();
    const minValue = this.minValue();
    const numeric = Number(target.value);
    if (maxValue !== undefined && numeric > maxValue) {
      target.value = maxValue.toString();
      this.updateControlValue(target.value);
    } else if (minValue !== undefined && numeric < minValue) {
      target.value = minValue.toString();
      this.updateControlValue(target.value);
    }
  }

  private updateControlValue(value: string): void {
    if (this.control?.control) {
      this.control.control.setValue(value, {
        emitEvent: false,
        emitModelToViewChange: true,
        emitViewToModelChange: true,
      });
    }
  }
}
