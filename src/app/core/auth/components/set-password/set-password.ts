import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxControlError } from 'ngxtension/control-error';
import { PasswordValidationItem } from '@core/auth/components/set-password/password-validation-item/password-validation-item';
import { toSignal } from '@angular/core/rxjs-interop';
import { passwordCriteria, passwordErrorValidator } from '@shared/helper/password-validator.helper';
import { ShowHidePasswordDirective } from '@shared/helper/directives/show-hide-password.directive';
import {
  buildStrongPassword,
  evaluatePasswordStrength,
  PasswordStrength,
  strengthText,
} from '@shared/helper/functions/password.function';

@Component({
  selector: 'app-set-password',
  imports: [
    ReactiveFormsModule,
    NgxControlError,
    CommonModule,
    PasswordValidationItem,
    ShowHidePasswordDirective,
  ],
  templateUrl: './set-password.html',
  styleUrl: './set-password.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AuthService],
})
export class SetPassword {
  private authService = inject(AuthService);
  protected readonly fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  toastr = inject(ToastrService);

  isValid = signal(true);
  userId = signal<number>(0);
  token = input('token');
  constructor() {
    // afterNextRender(() => {
    //   this.authService.tokenValidate(this.token()).subscribe({
    //     next: (res) => {
    // this.userId.set(1);
    // this.isValid.set(true);
    //     },
    //     error: () => {
    // this.isValid.set(false);
    //     },
    //   });
    // });
  }

  form = this.fb.group(
    {
      newPassword: this.fb.control('', [Validators.required, passwordCriteria()]),
      confirmNewPassword: this.fb.control('', [Validators.required]),
    },
    { validators: passwordErrorValidator('newPassword', 'confirmNewPassword') },
  );

  // Generate a strong password and fill both fields
  generatePassword() {
    const pwd = buildStrongPassword(10); // very strong
    this.form.controls.newPassword.setValue(pwd);
    this.form.controls.newPassword.markAsDirty();
    this.form.controls.confirmNewPassword.setValue(pwd);
    this.form.controls.confirmNewPassword.markAsDirty();
    this.form.updateValueAndValidity({ emitEvent: true });
  }

  // Strength meter
  private readonly newPasswordValue = toSignal(this.form.controls.newPassword.valueChanges, {
    initialValue: this.form.controls.newPassword.value ?? '',
  });

  readonly passwordStrength = computed<PasswordStrength>(() =>
    evaluatePasswordStrength((this.newPasswordValue() ?? '').toString()),
  );

  readonly passwordStrengthText = computed(() =>
    this.passwordStrength() === 'empty' ? '' : strengthText(this.passwordStrength()),
  );

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.authService.setNewPassword('', this.form.controls.newPassword.value as string).subscribe({
      next: () => {
        this.router
          .navigate(['/auth', 'login'])
          .then(() => this.toastr.success('Password set successfully'));
      },
    });
  }
}
