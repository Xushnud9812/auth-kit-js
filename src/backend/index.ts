/**
 * Auth-Kit-JS: Backend Module
 * 
 * Node.js-only authentication handlers
 */

// OAuth handlers (Google, Facebook)
export {
    handleOAuthCallback,
    createOAuthHandler,
    type HandleCallbackOptions,
    type OAuthConfigMap,
} from './oauth.js';

// Telegram OAuth handler
export {
    verifyTelegramOAuth,
    createTelegramHandler,
    type TelegramOAuthData,
} from './telegram.js';

// Re-export provider verification functions
export { handleGoogleCallback } from '../providers/google/verify.js';
export { handleFacebookCallback } from '../providers/facebook/verify.js';
