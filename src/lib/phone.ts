/**
 * Uzbek phone number handling. Canonical storage format is E.164:
 * +998 followed by 9 digits (e.g. +998901234567).
 */

const UZ_E164 = /^\+998\d{9}$/;

/**
 * Normalizes free-form user input to E.164 or returns null when the input
 * cannot be a valid Uzbek number. Accepts "+998 90 123 45 67",
 * "998901234567", "90 123 45 67" and similar variants.
 */
export function normalizeUzPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");

  let national: string;
  if (digits.length === 12 && digits.startsWith("998")) {
    national = digits.slice(3);
  } else if (digits.length === 9) {
    national = digits;
  } else {
    return null;
  }

  const candidate = `+998${national}`;
  return UZ_E164.test(candidate) ? candidate : null;
}

export function isValidUzPhone(input: string): boolean {
  return normalizeUzPhone(input) !== null;
}

/** Formats an E.164 number for display: +998 90 123 45 67. */
export function formatUzPhone(e164: string): string {
  if (!UZ_E164.test(e164)) return e164;
  const n = e164.slice(4);
  return `+998 ${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5, 7)} ${n.slice(7, 9)}`;
}

/** tel: href for an E.164 number. */
export function telHref(e164: string): string {
  return `tel:${e164}`;
}
