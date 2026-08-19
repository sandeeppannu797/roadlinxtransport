/* Shared shape and messages for the quote and contact forms.
 * Message strings are copied from the legacy PHP handlers. */

export interface FormState {
  error: string;
  success: string;
  /**
   * What the visitor typed, echoed back when the submission is rejected.
   * React resets an uncontrolled form once the action settles, so the
   * fields read these as their defaultValue to survive a validation
   * error — the behaviour legacy contact.php had via $_POST. On success
   * this is empty, which clears the form as the legacy pages did.
   */
  values?: Record<string, string>;
}

export const EMPTY_FORM_STATE: FormState = { error: '', success: '' };

export const ERR_REQUIRED = 'Please fill in all required fields.';
export const ERR_EMAIL = 'Please enter a valid email address.';
export const ERR_SEND = 'Sorry, something went wrong. Please try again.';

/** Mirrors PHP FILTER_VALIDATE_EMAIL closely enough for form validation. */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function field(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === 'string' ? value.trim() : '';
}
