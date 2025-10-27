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
export function passwordErrorValidator(
  passwordControlName: string,
  repeatPasswordControlName: string,
) {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const password = formGroup.get(passwordControlName);
    const repeatPassword = formGroup.get(repeatPasswordControlName);

    if (password && repeatPassword && password.value !== repeatPassword.value) {
      return { passwordError: true };
    }

    return null;
  };
}

export function passwordCriteria(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /\W/.test(value); // or /[^a-zA-Z0-9]/ for stricter special chars
    const isValidLength = value.length >= 8;

    const errors: ValidationErrors = {};

    if (!isValidLength) {
      errors['newLength'] = true;
    }

    if (!hasUpperCase) {
      errors['newUpperCase'] = true;
    }

    if (!hasLowerCase) {
      errors['newLowerCase'] = true;
    }

    if (!hasNumber) {
      errors['newNumber'] = true;
    }

    if (!hasSpecialChar) {
      errors['newSpecialChar'] = true;
    }

    return Object.keys(errors).length ? errors : null;
  };
}
