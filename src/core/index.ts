/**
 * Auth-Kit-JS: Core Module
 * 
 * Re-exports all core functionality
 */

// Types
export * from './types.js';

// Errors
export * from './errors.js';

// Crypto utilities
export {
    generateState,
    generateCodeVerifier,
    generateCodeChallenge,
    hmacSha256,
    sha256,
    timingSafeEqual,
    base64UrlEncode,
    base64UrlDecode,
    generateRandomString,
} from './crypto.js';

// General utilities
export {
    isValidRedirectUri,
    buildQueryString,
    parseQueryString,
    buildUrl,
    createNormalizedProfile,
    isBrowser,
    isNode,
    getCurrentTimestamp,
    isExpired,
} from './utils.js';
