import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { NgxControlError } from 'ngxtension/control-error';
import { UserService } from '../../../services/user.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UserProfileDto } from '../../../models/user-list-model';
import { NgSelectComponent, NgOptionComponent } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-edit-user',
  imports: [NgxControlError, ReactiveFormsModule, NgSelectComponent, NgOptionComponent],
  templateUrl: './create-edit-user.html',
  styleUrl: './create-edit-user.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditUser {
  private readonly toastr = inject(ToastrService);
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  readonly bsModalRef = inject(BsModalRef);

  user!: UserProfileDto;
  roles: { roleId: number; roleName: string }[] = this.bsModalRef.content?.roles || [];

  form: FormGroup;
  submitting = false;

  @Output() formSubmit = new EventEmitter<boolean>();
  constructor() {
    this.form = this.fb.record(
      {
        firstName: this.fb.nonNullable.control<string>('', { validators: [Validators.required] }),
        lastName: this.fb.nonNullable.control<string>('', { validators: [Validators.required] }),
        email: this.fb.nonNullable.control<string>('', { validators: [Validators.required] }),
        phone: this.fb.nonNullable.control<string>('', { validators: [Validators.required] }),
        roleId: this.fb.nonNullable.control<number | null>(null, {
          validators: [Validators.required],
        }),
        userName: this.fb.nonNullable.control<string>('', { validators: [Validators.required] }),
        passwordHash: this.fb.nonNullable.control<string>('', {
          validators: [Validators.required],
        }),
        confirmPassword: this.fb.nonNullable.control<string>('', {
          validators: [Validators.required],
        }),
      },
      { validators: [this.passwordsMatchValidator] },
    );
    afterNextRender(() => {
      if (this.user) {
        this.form.patchValue(this.user);
        this.form.get('userName')?.clearValidators();
        this.form.get('userName')?.disable();
        this.form.get('passwordHash')?.clearValidators();
        this.form.get('passwordHash')?.disable();
        this.form.get('confirmPassword')?.clearValidators();
        this.form.get('confirmPassword')?.disable();
        this.form.updateValueAndValidity();
      } else {
        this.form.get('userName')?.setValidators([Validators.required]);
        this.form.get('userName')?.enable();
        this.form.get('passwordHash')?.setValidators([Validators.required]);
        this.form.get('passwordHash')?.enable();
        this.form.get('confirmPassword')?.setValidators([Validators.required]);
        this.form.get('confirmPassword')?.enable();
        this.form.updateValueAndValidity();
      }
    });
  }

  passwordsMatchValidator(control: import('@angular/forms').AbstractControl) {
    const form = control as FormGroup;
    const password = form.get('passwordHash')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  submit() {
    this.submitting = true;
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.submitting = false;
      return;
    }
    const userData = { ...this.form.value };
    delete userData.confirmPassword;
    const request$ = this.user
      ? this.userService.updateUser(this.user.id || 0, userData)
      : this.userService.saveUser(userData);
    request$.subscribe({
      next: () => {
        if (this.user) {
          this.toastr.success('User updated successfully');
        } else {
          this.toastr.success('User saved successfully');
        }
        this.form.reset();
        this.submitting = false;
        this.formSubmit.emit(true);
        this.bsModalRef.hide();
      },
      error: () => {
        // Optionally show error message
        this.submitting = false;
      },
    });
  }
  isSubmitting() {
    return this.submitting;
  }
  back() {
    this.bsModalRef.hide();
    this.formSubmit.emit(false);
  }
}
