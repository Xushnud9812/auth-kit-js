/**
 * Auth-Kit-JS: Utility Functions
 * 
 * Common utilities used across the library
 */

import type { NormalizedProfile, Provider } from './types.js';

/**
 * Allowed redirect URI schemes
 */
const ALLOWED_SCHEMES = ['https:', 'http:'];

/**
 * Validate a redirect URI for security
 * Prevents open redirect vulnerabilities
 * 
 * @param uri - The redirect URI to validate
 * @param allowedOrigins - Optional list of allowed origins
 * @returns True if URI is valid
 */
export function isValidRedirectUri(uri: string, allowedOrigins?: string[]): boolean {
    try {
        const url = new URL(uri);

        // Check scheme
        if (!ALLOWED_SCHEMES.includes(url.protocol)) {
            return false;
        }

        // Allow localhost for development
        if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
            return true;
        }

        // If allowed origins specified, check against them
        if (allowedOrigins && allowedOrigins.length > 0) {
            return allowedOrigins.some((origin) => {
                const allowedUrl = new URL(origin);
                return url.origin === allowedUrl.origin;
            });
        }

        // Default: require HTTPS for non-localhost
        return url.protocol === 'https:';
    } catch {
        return false;
    }
}

/**
 * Build a URL query string from an object
 * 
 * @param params - Object of key-value pairs
 * @returns Encoded query string (without leading ?)
 */
export function buildQueryString(params: Record<string, string | undefined | null>): string {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value);
        }
    }

    return searchParams.toString();
}

/**
 * Parse a query string into an object
 * 
 * @param queryString - The query string (with or without leading ?)
 * @returns Object of key-value pairs
 */
export function parseQueryString(queryString: string): Record<string, string> {
    const query = queryString.startsWith('?') ? queryString.slice(1) : queryString;
    const params = new URLSearchParams(query);
    const result: Record<string, string> = {};

    for (const [key, value] of params.entries()) {
        result[key] = value;
    }

    return result;
}

/**
 * Build a full URL with query parameters
 * 
 * @param baseUrl - The base URL
 * @param params - Query parameters to add
 * @returns Full URL with query string
 */
export function buildUrl(baseUrl: string, params: Record<string, string | undefined | null>): string {
    const url = new URL(baseUrl);

    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== '') {
            url.searchParams.append(key, value);
        }
    }

    return url.toString();
}

/**
 * Safely extract a nested property from an object
 * 
 * @param obj - The object to extract from
 * @param path - Dot-separated path (e.g., 'user.profile.name')
 * @returns The value at the path, or undefined
 */
export function getNestedValue(obj: unknown, path: string): unknown {
    if (!obj || typeof obj !== 'object') {
        return undefined;
    }

    const keys = path.split('.');
    let current: unknown = obj;

    for (const key of keys) {
        if (current === null || current === undefined) {
            return undefined;
        }
        if (typeof current !== 'object') {
            return undefined;
        }
        current = (current as Record<string, unknown>)[key];
    }

    return current;
}

/**
 * Check if a value is a non-null object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Create a normalized profile from provider data
 * This is a helper - each provider should have its own normalizer
 * 
 * @param data - Raw provider data
 * @returns Partially filled NormalizedProfile
 */
export function createNormalizedProfile(
    provider: Provider,
    providerUserId: string,
    data: {
        email?: string;
        name?: string;
        avatarUrl?: string;
        raw: unknown;
    }
): NormalizedProfile {
    return {
        provider,
        providerUserId: String(providerUserId),
        email: data.email || undefined,
        name: data.name || undefined,
        avatarUrl: data.avatarUrl || undefined,
        raw: data.raw,
    };
}

/**
 * Sleep for a specified duration
 * Useful for rate limiting or retry logic
 * 
 * @param ms - Milliseconds to sleep
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 * 
 * @param fn - Function to retry
 * @param maxRetries - Maximum number of retries
 * @param baseDelay - Base delay in ms (doubles each retry)
 * @returns Result of the function
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));

            if (attempt < maxRetries) {
                await sleep(baseDelay * Math.pow(2, attempt));
            }
        }
    }

    throw lastError;
}

/**
 * Check if running in a browser environment
 */
export function isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Check if running in Node.js environment
 */
export function isNode(): boolean {
    return typeof process !== 'undefined' &&
        process.versions != null &&
        process.versions.node != null;
}

/**
 * Get current Unix timestamp in seconds
 */
export function getCurrentTimestamp(): number {
    return Math.floor(Date.now() / 1000);
}

/**
 * Check if a timestamp is expired
 * 
 * @param timestamp - Unix timestamp in seconds
 * @param ttlSeconds - Time-to-live in seconds
 * @returns True if expired
 */
export function isExpired(timestamp: number, ttlSeconds: number): boolean {
    return getCurrentTimestamp() - timestamp > ttlSeconds;
}
