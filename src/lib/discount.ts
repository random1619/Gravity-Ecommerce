// Centralized discount / promo-code logic for GRAVITY.
// Single source of truth — previously duplicated inline in cart & checkout pages.

/** Fraction of the subtotal discounted for eligible students (20%). */
export const STUDENT_DISCOUNT_RATE = 0.2;

/** Promo codes accepted by the storefront, mapped to a human label. */
export const PROMO_CODES: Record<string, { label: string }> = {
    STUDENT20: { label: 'Student Discount (20%)' },
};

/** localStorage key for the currently applied promo code. */
export const APPLIED_PROMO_KEY = 'gravity-applied-promo';

/** localStorage key flagging a verified student. */
export const STUDENT_VERIFIED_KEY = 'gravity-student-verified';

/**
 * Normalizes a raw promo-code entry (trim + uppercase) and returns it if valid,
 * otherwise null. Empty input returns null.
 */
export function normalizePromoCode(raw: string): string | null {
    const code = raw.trim().toUpperCase();
    if (!code) return null;
    return code in PROMO_CODES ? code : null;
}

/** True when the cart qualifies for the student discount. */
export function isDiscountEligible(isVerified: boolean, appliedPromo: string): boolean {
    return isVerified || appliedPromo in PROMO_CODES;
}

/**
 * Computes the student discount for a subtotal. Returns 0 when not eligible.
 * Result is rounded to the nearest whole currency unit (₹).
 */
export function studentDiscount(
    subtotal: number,
    isVerified: boolean,
    appliedPromo: string
): number {
    if (!isDiscountEligible(isVerified, appliedPromo)) return 0;
    return Math.round(subtotal * STUDENT_DISCOUNT_RATE);
}
