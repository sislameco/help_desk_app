import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NAME_REGEX, PHONE_REGEX } from '@shared/const/regex.const';

export function requiredTrimmed(): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    const v = (c.value ?? '').toString().trim();
    return v === '' ? { required: true } : null;
  };
}

export function namePattern(): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    const v = (c.value ?? '').toString().trim();
    if (v === '') {
      return null;
    }
    return NAME_REGEX.test(v) ? null : { pattern: true };
  };
}

export function optionalPhone(): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    const v = (c.value ?? '').toString().trim();
    if (v === '') {
      return null;
    }
    return PHONE_REGEX.test(v) ? null : { phone: true };
  };
}

/**
 * Ensures the control's value is an array with at least one item.
 * Returns { required: true } to align with existing required error handling.
 */
export function arrayRequired(): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    const v = c.value as unknown;
    return Array.isArray(v) && v.length > 0 ? null : { required: true };
  };
}

export function nameValidators(): ValidatorFn[] {
  return [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(100),
    requiredTrimmed(),
    namePattern(),
  ];
}

export function emailValidators(): ValidatorFn[] {
  return [Validators.required, Validators.email, Validators.maxLength(254), requiredTrimmed()];
}

export function phoneValidators(): ValidatorFn[] {
  return [optionalPhone()];
}
