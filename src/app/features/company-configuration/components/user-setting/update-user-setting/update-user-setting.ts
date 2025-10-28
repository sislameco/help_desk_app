import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserSettingService } from '../../../services/user-setting.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxControlError } from 'ngxtension/control-error';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { derivedAsync } from 'ngxtension/derived-async';
import { UserRoleService } from '../../../../user-management/services/user-role.service';
import { UserSetupOutputDto } from '../../../models/user-setting.model';

@Component({
  selector: 'app-update-user-setting',
  imports: [NgxControlError, ReactiveFormsModule, NgSelectComponent, NgOptionComponent],
  templateUrl: './update-user-setting.html',
  styleUrl: './update-user-setting.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateUserSetting {
  private readonly toastr = inject(ToastrService);
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserSettingService);
  readonly bsModalRef = inject(BsModalRef);
  readonly userRoleService = inject(UserRoleService);

  user!: UserSetupOutputDto;
  departments!: { id: number; fullName: string }[];
  roles: { roleId: number; roleName: string }[] = this.bsModalRef.content?.roles || [];

  form: FormGroup;
  submitting = false;

  @Output() formSubmit = new EventEmitter<boolean>();

  protected readonly roleDropdown = derivedAsync(() => this.userRoleService.getRoleDropdown());

  constructor() {
    this.form = this.fb.record({
      id: this.fb.nonNullable.control<number>(0),
      firstName: this.fb.nonNullable.control<string>(''),
      lastName: this.fb.nonNullable.control<string>(''),
      email: this.fb.nonNullable.control<string>(''),
      phone: this.fb.nonNullable.control<string>(''),
      roleId: this.fb.nonNullable.control<number | null>(null, {
        validators: [Validators.required],
      }),
      departmentId: this.fb.nonNullable.control<number | null>(null, {
        validators: [Validators.required],
      }),
      isAdmin: this.fb.nonNullable.control<boolean | null>(false),
    });
    afterNextRender(() => {
      if (this.user) {
        this.form.patchValue(this.user);
        this.form.updateValueAndValidity();
      } else {
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
    // const request$ = this.user
    //   ? this.userService.updateUser(this.user.id || 0, userData)
    //   : this.userService.saveUser(userData);
    this.userService.updateUser(userData).subscribe({
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
