import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { NgClass } from '@angular/common';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-password-validation-item',
  imports: [NgClass],
  templateUrl: './password-validation-item.html',
  styleUrl: './password-validation-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordValidationItem implements OnInit, OnDestroy {
  private ngUnsubscribe$ = new Subject<void>();

  // readonly control = input.required<AbstractControl>();
  @Input() control!: AbstractControl;

  readonly errorKey = input.required<string>();
  readonly message = input.required<string>();

  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    const ctrl = this.control;
    if (!ctrl) {
      return;
    }

    // Ensure this OnPush component updates as the control changes
    merge(ctrl.valueChanges, ctrl.statusChanges)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.cdr.markForCheck());
  }

  get hasError(): boolean {
    const control = this.control;
    return control.dirty && !control.errors?.['required'] && control.errors?.[this.errorKey()];
  }

  get isValid(): boolean {
    const control = this.control;
    return control.dirty && !control.errors?.['required'] && !control.errors?.[this.errorKey()];
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
