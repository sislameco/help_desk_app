import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { PasswordError } from '@shared/helper/password.model';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (!value) {
      return null;
    }

    const errors: Partial<Record<PasswordError, boolean>> = {};

    if (value.length < 8) {
      errors.minlength = true; // ✅ dot notation is valid now
    }
    if (!/[A-Z]/.test(value)) {
      errors.uppercase = true;
    }
    if (!/[a-z]/.test(value)) {
      errors.lowercase = true;
    }
    if (!/[0-9]/.test(value)) {
      errors.digit = true;
    }
    if (!/[^a-zA-Z0-9]/.test(value)) {
      errors.special = true;
    }

    return Object.keys(errors).length ? errors : null;
  };
}
