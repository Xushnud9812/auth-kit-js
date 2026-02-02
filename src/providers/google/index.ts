/**
 * Auth-Kit-JS: Google Provider
 * 
 * Re-exports all Google OAuth functionality
 */

// Types
export * from './types.js';

// OAuth URL building
export {
    GOOGLE_ENDPOINTS,
    GOOGLE_DEFAULT_SCOPES,
    buildGoogleAuthUrl,
    createGoogleOAuthHelper,
} from './oauth.js';

// Token verification (Node.js only)
export {
    exchangeGoogleCode,
    decodeJwt,
    verifyGoogleIdToken,
    fetchGoogleUserProfile,
    handleGoogleCallback,
    normalizeGoogleProfile,
} from './verify.js';
