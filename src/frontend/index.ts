/**
 * Auth-Kit-JS: Frontend Module
 * 
 * Browser-only helpers for authentication
 */

// Button helpers
export {
    getAuthButtons,
    getAuthButton,
    createButtonHelper,
} from './buttons.js';

// OAuth helpers (Google, Facebook)
export {
    startOAuth,
    startOAuthPopup,
    retrieveOAuthState,
    validateState,
    type StartOAuthOptions,
} from './oauth.js';

// Telegram OAuth helpers
export {
    startTelegramOAuth,
    handleTelegramOAuthCallback,
    type TelegramOAuthOptions,
    type TelegramOAuthResult,
} from './telegram.js';
