import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgxControlError } from 'ngxtension/control-error';
import { ActivatedRoute, RouterLink } from '@angular/router';

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
  protected readonly sent = signal(false);
  route = inject(ActivatedRoute);
  protected readonly fb = inject(FormBuilder);
  protected readonly form = this.fb.group({
    email: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  protected onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      this.sent.set(true);
    }, 1200);
  }
}
