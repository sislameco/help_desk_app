import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxControlError } from 'ngxtension/control-error';

@Component({
  selector: 'app-verification-code',
  imports: [ReactiveFormsModule, NgxControlError, RouterLink],
  templateUrl: './verification-code.html',
  styleUrl: './verification-code.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificationCode {
  protected readonly loading = signal(false);
  auth = inject(AuthService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  otp = input('otp');
  toastr = inject(ToastrService);

  protected readonly sent = signal(false);
  protected readonly fb = inject(FormBuilder);
  protected readonly form = this.fb.group({
    otp: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.auth
      .verifyOtp(this.form.controls.otp.value, this.route.snapshot.queryParams['token'])
      .subscribe({
        next: (res) => {
          this.toastr.success('Email sent successfully!');
          this.router.navigate(['/auth/set-password'], {
            queryParams: {
              token: this.route.snapshot.queryParams['token'],
              userName: this.route.snapshot.queryParams['userName'],
              userId: res.data,
            },
          });
        },
      });
  }
}
