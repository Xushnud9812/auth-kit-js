/**
 * Auth-Kit-JS: Backend Module
 * 
 * Node.js-only authentication handlers
 */

// OAuth handlers
export {
    handleOAuthCallback,
    createOAuthHandler,
    type HandleCallbackOptions,
    type OAuthConfigMap,
} from './oauth.js';

// Telegram handlers
export {
    verifyTelegramWebApp,
    verifyTelegramLoginWidget,
    createTelegramHandler,
} from './telegram.js';

// Re-export provider verification functions
export { handleGoogleCallback } from '../providers/google/verify.js';
export { handleFacebookCallback } from '../providers/facebook/verify.js';
