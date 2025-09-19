import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgxControlError } from 'ngxtension/control-error';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, NgxControlError, RouterLink],
})
export class Register {
  protected readonly loading = signal(false);
  protected readonly fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  protected readonly form = this.fb.group({
    name: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    email: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
    confirmPassword: this.fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.loading.set(true);
    // Simulate register
    setTimeout(() => this.loading.set(false), 1200);
  }
}
