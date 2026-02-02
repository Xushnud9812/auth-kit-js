/**
 * Auth-Kit-JS: Frontend Telegram Helper
 * 
 * Browser-side helpers for Telegram WebApp authentication
 */

import type { TelegramUser } from '../providers/telegram/types.js';

/**
 * Telegram WebApp interface (partial)
 * Available at window.Telegram.WebApp
 */
interface TelegramWebApp {
    initData: string;
    initDataUnsafe: {
        query_id?: string;
        user?: TelegramUser;
        auth_date: number;
        hash: string;
    };
    version: string;
    platform: string;
    colorScheme: 'light' | 'dark';
    themeParams: {
        bg_color?: string;
        text_color?: string;
        button_color?: string;
        button_text_color?: string;
    };
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    ready(): void;
    expand(): void;
    close(): void;
}

declare global {
    interface Window {
        Telegram?: {
            WebApp?: TelegramWebApp;
        };
    }
}

/**
 * Check if running inside Telegram WebApp
 */
export function isTelegramWebApp(): boolean {
    return typeof window !== 'undefined' &&
        typeof window.Telegram !== 'undefined' &&
        typeof window.Telegram.WebApp !== 'undefined' &&
        !!window.Telegram.WebApp.initData;
}

/**
 * Get Telegram WebApp instance
 * 
 * @returns WebApp instance or null if not in Telegram
 */
export function getTelegramWebApp(): TelegramWebApp | null {
    if (!isTelegramWebApp()) {
        return null;
    }
    return window.Telegram!.WebApp!;
}

/**
 * Get Telegram initData for server verification
 * 
 * @returns The raw initData string or null if not in Telegram
 */
export function getTelegramInitData(): string | null {
    const webapp = getTelegramWebApp();
    return webapp?.initData || null;
}

/**
 * Get Telegram user data (unverified)
 * WARNING: This data comes from the client and should be verified server-side
 * 
 * @returns User data or null if not available
 */
export function getTelegramUser(): TelegramUser | null {
    const webapp = getTelegramWebApp();
    return webapp?.initDataUnsafe?.user || null;
}

/**
 * Get Telegram WebApp theme
 * 
 * @returns Theme parameters
 */
export function getTelegramTheme() {
    const webapp = getTelegramWebApp();
    if (!webapp) {
        return null;
    }

    return {
        colorScheme: webapp.colorScheme,
        ...webapp.themeParams,
    };
}

/**
 * Initialize Telegram WebApp and signal readiness
 * Call this when your app is ready to be displayed
 */
export function initTelegramWebApp(): void {
    const webapp = getTelegramWebApp();
    if (webapp) {
        webapp.ready();
    }
}

/**
 * Expand Telegram WebApp to full height
 */
export function expandTelegramWebApp(): void {
    const webapp = getTelegramWebApp();
    if (webapp) {
        webapp.expand();
    }
}

/**
 * Close Telegram WebApp
 */
export function closeTelegramWebApp(): void {
    const webapp = getTelegramWebApp();
    if (webapp) {
        webapp.close();
    }
}

/**
 * Send initData to your backend for verification
 * 
 * @param backendUrl - Your backend verification endpoint
 * @returns Response from backend
 */
export async function verifyTelegramWithBackend<T = unknown>(
    backendUrl: string
): Promise<T> {
    const initData = getTelegramInitData();

    if (!initData) {
        throw new Error('Not running in Telegram WebApp');
    }

    const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initData }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Verification failed');
    }

    return response.json() as Promise<T>;
}
