/**
 * Auth-Kit-JS: Crypto Utilities
 * 
 * Universal cryptographic helpers that work in both browser and Node.js
 */

/**
 * Generate a cryptographically secure random string
 * Used for OAuth state and PKCE code verifier
 * 
 * @param length - Length of the random string (default: 32)
 * @returns Random URL-safe base64 string
 */
export function generateRandomString(length: number = 32): string {
    const array = new Uint8Array(length);

    // Use Web Crypto API (available in both browser and Node.js 18+)
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(array);
    } else {
        throw new Error('Crypto API not available');
    }

    // Convert to URL-safe base64
    return base64UrlEncode(array);
}

/**
 * Generate OAuth state parameter
 * 
 * @returns Cryptographically secure state string
 */
export function generateState(): string {
    return generateRandomString(32);
}

/**
 * Generate PKCE code verifier
 * Must be between 43-128 characters per RFC 7636
 * 
 * @returns Code verifier string
 */
export function generateCodeVerifier(): string {
    return generateRandomString(48);
}

/**
 * Generate PKCE code challenge from verifier
 * Uses S256 method (SHA-256 hash of verifier)
 * 
 * @param verifier - The code verifier
 * @returns Code challenge string (base64url encoded SHA-256 hash)
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);

    // Use Web Crypto API
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    return base64UrlEncode(new Uint8Array(hashBuffer));
}

/**
 * Compute HMAC-SHA256
 * Used for Telegram data verification
 * 
 * @param key - The secret key
 * @param message - The message to sign
 * @returns Hex-encoded HMAC
 */
export async function hmacSha256(key: string | Uint8Array, message: string): Promise<string> {
    const encoder = new TextEncoder();

    // Convert key to Uint8Array if string
    const keyData = typeof key === 'string' ? encoder.encode(key) : key;
    const messageData = encoder.encode(message);

    // Import key - use type assertion to work around TypeScript strictness
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData as unknown as ArrayBuffer,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    // Sign
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);

    // Convert to hex
    return arrayBufferToHex(signature);
}

/**
 * Compute SHA-256 hash
 * 
 * @param message - The message to hash
 * @returns Uint8Array of hash
 */
export async function sha256(message: string): Promise<Uint8Array> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return new Uint8Array(hashBuffer);
}

/**
 * Timing-safe string comparison
 * Prevents timing attacks when comparing secrets
 * 
 * @param a - First string
 * @param b - Second string
 * @returns True if strings are equal
 */
export function timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) {
        // Still compare to prevent length-based timing attacks
        // Use dummy comparison with self
        timingSafeCompare(a, a);
        return false;
    }

    return timingSafeCompare(a, b);
}

/**
 * Internal timing-safe comparison
 */
function timingSafeCompare(a: string, b: string): boolean {
    const encoder = new TextEncoder();
    const aBytes = encoder.encode(a);
    const bBytes = encoder.encode(b);

    let result = 0;
    for (let i = 0; i < aBytes.length; i++) {
        result |= aBytes[i] ^ bBytes[i];
    }

    return result === 0;
}

/**
 * Convert Uint8Array to URL-safe base64
 */
export function base64UrlEncode(array: Uint8Array): string {
    // Convert to regular base64 first
    let base64 = '';

    // In browser, use btoa with String.fromCharCode
    // In Node.js 18+, btoa is available globally
    if (typeof btoa !== 'undefined') {
        const binString = Array.from(array, (byte) => String.fromCharCode(byte)).join('');
        base64 = btoa(binString);
    } else {
        // Fallback for older Node.js (shouldn't happen with Node 18+ requirement)
        base64 = Buffer.from(array).toString('base64');
    }

    // Make URL-safe
    return base64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

/**
 * Decode URL-safe base64 to Uint8Array
 */
export function base64UrlDecode(str: string): Uint8Array {
    // Convert from URL-safe to regular base64
    let base64 = str
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    // Add padding if needed
    while (base64.length % 4) {
        base64 += '=';
    }

    // Decode
    if (typeof atob !== 'undefined') {
        const binString = atob(base64);
        return Uint8Array.from(binString, (char) => char.charCodeAt(0));
    } else {
        return new Uint8Array(Buffer.from(base64, 'base64'));
    }
}

/**
 * Convert ArrayBuffer to hex string
 */
export function arrayBufferToHex(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Convert hex string to Uint8Array
 */
export function hexToUint8Array(hex: string): Uint8Array {
    const matches = hex.match(/.{1,2}/g);
    if (!matches) return new Uint8Array(0);
    return new Uint8Array(matches.map((byte) => parseInt(byte, 16)));
}
