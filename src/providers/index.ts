/**
 * Auth-Kit-JS: Providers Module
 * 
 * Re-exports all provider functionality
 */

// Google
export * as google from './google/index.js';
export {
    buildGoogleAuthUrl,
    handleGoogleCallback,
    normalizeGoogleProfile,
    GOOGLE_ENDPOINTS,
    GOOGLE_DEFAULT_SCOPES,
} from './google/index.js';
export type {
    GoogleConfig,
    GoogleTokenResponse,
    GoogleIdTokenClaims,
    GoogleUserProfile,
} from './google/index.js';

// Facebook
export * as facebook from './facebook/index.js';
export {
    buildFacebookAuthUrl,
    handleFacebookCallback,
    normalizeFacebookProfile,
    FACEBOOK_ENDPOINTS,
    FACEBOOK_DEFAULT_SCOPES,
} from './facebook/index.js';
export type {
    FacebookConfig,
    FacebookTokenResponse,
    FacebookUserProfile,
} from './facebook/index.js';

// Telegram OAuth
export * as telegram from './telegram/index.js';
export {
    buildTelegramOAuthUrl,
    parseTelegramOAuthCallback,
    extractBotId,
    normalizeOAuthProfile,
} from './telegram/index.js';
export type {
    TelegramUser,
    TelegramOAuthConfig,
    TelegramOAuthCallbackData,
} from './telegram/index.js';
