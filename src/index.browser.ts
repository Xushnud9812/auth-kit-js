/**
 * Auth-Kit-JS: Browser Entry Point
 * 
 * Browser-only exports
 */

// Core exports
export * from './core/index.js';

// Frontend-specific exports
export * from './frontend/index.js';

// Provider types and URL builders (no Node.js code)
export {
    buildGoogleAuthUrl,
    buildFacebookAuthUrl,
    buildTelegramOAuthUrl,
    GOOGLE_DEFAULT_SCOPES,
    FACEBOOK_DEFAULT_SCOPES,
    GOOGLE_ENDPOINTS,
    FACEBOOK_ENDPOINTS,
} from './providers/index.js';

export type {
    GoogleConfig,
    FacebookConfig,
    TelegramUser,
    TelegramOAuthConfig,
} from './providers/index.js';
