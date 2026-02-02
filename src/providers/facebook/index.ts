/**
 * Auth-Kit-JS: Facebook Provider
 * 
 * Re-exports all Facebook OAuth functionality
 */

// Types
export * from './types.js';

// OAuth URL building
export {
    FACEBOOK_ENDPOINTS,
    FACEBOOK_DEFAULT_SCOPES,
    buildFacebookAuthUrl,
    createFacebookOAuthHelper,
} from './oauth.js';

// Token verification (Node.js only)
export {
    exchangeFacebookCode,
    fetchFacebookProfile,
    handleFacebookCallback,
    normalizeFacebookProfile,
} from './verify.js';
