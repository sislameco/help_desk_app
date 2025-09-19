import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxControlError } from 'ngxtension/control-error';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';
import { LoginRequest } from '@core/auth/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { passwordValidator } from '@shared/helper/password-validator.helper';
import { AuthStore } from '@core/store/auth-store/auth.store';

@Component({
  selector: 'app-auth-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, NgxControlError, RouterLink],
})
export class Login {
  authStore = inject(AuthStore);
  readonly loading = signal(false);
  protected readonly fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  auth = inject(AuthService);
  router = inject(Router);
  toastr = inject(ToastrService);
  readonly form = this.fb.group({
    email: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8), passwordValidator],
    }),
  });

  onSubmit() {
    if (this.form.invalid || this.form.pristine) {
      return;
    }
    this.loading.set(true);
    // Trim email and password before submit, but do NOT mutate the form controls
    const { email, password } = this.form.getRawValue();
    const data: LoginRequest = { email: email.trim(), password: password.trim() };

    this.authStore.login(data);
  }
}
