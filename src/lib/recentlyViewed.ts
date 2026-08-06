/**
 * Recently-viewed products, persisted in localStorage.
 * Shared by QuickView (records views) and the shop page (renders the rail).
 */

export interface RecentProduct {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
}

const KEY = 'gravity:recently-viewed';
const MAX_ITEMS = 8;

export function getRecentlyViewed(): RecentProduct[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = window.localStorage.getItem(KEY);
        if (!raw) return [];
        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(
            (p): p is RecentProduct =>
                !!p && typeof p === 'object' &&
                typeof (p as RecentProduct).id === 'string' &&
                typeof (p as RecentProduct).name === 'string' &&
                typeof (p as RecentProduct).imageUrl === 'string'
        );
    } catch {
        return [];
    }
}

export function recordProductView(product: RecentProduct): void {
    if (typeof window === 'undefined') return;
    try {
        const existing = getRecentlyViewed().filter(p => p.id !== product.id);
        const next = [product, ...existing].slice(0, MAX_ITEMS);
        window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
        // storage full / blocked — non-critical
    }
}
