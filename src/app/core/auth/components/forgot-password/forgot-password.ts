import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgxControlError } from 'ngxtension/control-error';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@core/auth/services/auth.service';

@Component({
  selector: 'app-auth-forgot-password',
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, NgxControlError, RouterLink],
})
export class ForgotPassword {
  protected readonly loading = signal(false);
  auth = inject(AuthService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  userName = input('userName');
  toastr = inject(ToastrService);

  protected readonly sent = signal(false);
  protected readonly fb = inject(FormBuilder);
  protected readonly form = this.fb.group({
    userName: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.auth.forgetPassword(this.form.controls.userName.value).subscribe({
      next: (res) => {
        this.toastr.success('Email sent successfully!');
        this.router.navigate(['/auth/verification-code'], {
          queryParams: {
            token: res.data,
            userName: this.form.controls.userName.value,
          },
        });
      },
    });
  }
}
