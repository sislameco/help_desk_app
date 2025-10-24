export type PasswordStrength = 'empty' | 'weak' | 'medium' | 'strong';

export function buildStrongPassword(length = 16): string {
  const lowers = 'abcdefghijklmnopqrstuvwxyz';
  const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const specials = '!@#$%^&*';
  const all = lowers + uppers + digits + specials;

  const pick = (pool: string) => pool[Math.floor(Math.random() * pool.length)];

  // Ensure minimum one from each group
  const required = [pick(lowers), pick(uppers), pick(digits), pick(specials)];

  const rest = Array.from({ length: Math.max(length - required.length, 0) }, () => pick(all));

  // Shuffle
  const chars = [...required, ...rest];
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

/**
 * Pure function that classifies password strength.
 * No Angular dependencies.
 */
export function evaluatePasswordStrength(value: string): PasswordStrength {
  const pwd = (value ?? '').toString();
  if (!pwd) {
    return 'empty';
  }

  const lengthScore = pwd.length >= 12 ? 2 : pwd.length >= 8 ? 1 : 0;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasDigit = /\d/.test(pwd);
  const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
  const variety = [hasUpper, hasLower, hasDigit, hasSpecial].filter(Boolean).length;

  if (lengthScore === 2 && variety >= 3) {
    return 'strong';
  }
  if ((lengthScore >= 1 && variety >= 3) || (lengthScore === 2 && variety === 2)) {
    return 'medium';
  }
  return 'weak';
}

/** User-facing label for a given strength value */
export function strengthText(strength: PasswordStrength): string {
  switch (strength) {
    case 'strong':
      return 'Strong';
    case 'medium':
      return 'Medium';
    case 'weak':
      return 'Weak';
    default:
      return '';
  }
}
