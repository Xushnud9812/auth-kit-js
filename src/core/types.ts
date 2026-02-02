/**
 * Auth-Kit-JS: Core Types
 * 
 * All shared types and interfaces used across the library
 */

// =============================================================================
// Provider Types
// =============================================================================

/**
 * Supported authentication providers
 */
export type Provider = 'google' | 'facebook' | 'telegram';

/**
 * Normalized user profile from any provider
 * This is the standardized shape that all providers must output
 */
export interface NormalizedProfile {
    /** The authentication provider */
    provider: Provider;
    /** Unique user ID from the provider */
    providerUserId: string;
    /** User's email address (if available) */
    email?: string;
    /** User's display name */
    name?: string;
    /** URL to user's avatar/profile picture */
    avatarUrl?: string;
    /** Raw response from the provider (for advanced use cases) */
    raw: unknown;
}

// =============================================================================
// OAuth Configuration
// =============================================================================

/**
 * Base OAuth configuration for any provider
 */
export interface OAuthConfig {
    /** OAuth client ID */
    clientId: string;
    /** OAuth client secret (backend only) */
    clientSecret: string;
    /** Redirect URI for OAuth callback */
    redirectUri: string;
    /** OAuth scopes to request */
    scopes?: string[];
}

/**
 * Google-specific OAuth configuration
 */
export interface GoogleOAuthConfig extends OAuthConfig {
    /** Enable OpenID Connect (default: true) */
    useOIDC?: boolean;
    /** Hosted domain restriction (for G Suite) */
    hostedDomain?: string;
    /** Login hint (email or sub) */
    loginHint?: string;
}

/**
 * Facebook-specific OAuth configuration
 */
export interface FacebookOAuthConfig extends OAuthConfig {
    /** Auth type: 'rerequest' to re-ask for declined permissions */
    authType?: 'rerequest';
}

// =============================================================================
// Telegram Configuration
// =============================================================================

/**
 * Telegram authentication configuration
 */
export interface TelegramConfig {
    /** Telegram Bot Token */
    botToken: string;
    /** Maximum age of auth_date in seconds (default: 86400 = 24 hours) */
    authDateTTL?: number;
}

/**
 * Telegram user data from WebApp or Login Widget
 */
export interface TelegramUserData {
    /** Telegram user ID */
    id: number;
    /** User's first name */
    first_name: string;
    /** User's last name (optional) */
    last_name?: string;
    /** User's username (optional) */
    username?: string;
    /** User's profile photo URL (optional) */
    photo_url?: string;
    /** Unix timestamp of authentication */
    auth_date: number;
    /** Hash for verification */
    hash: string;
}

/**
 * Telegram WebApp init data structure
 */
export interface TelegramWebAppData {
    /** The user object */
    user?: TelegramUserData;
    /** Query ID for inline mode */
    query_id?: string;
    /** Authentication date */
    auth_date: number;
    /** Verification hash */
    hash: string;
    /** Raw init data string */
    raw: string;
}

// =============================================================================
// Auth Kit Configuration
// =============================================================================

/**
 * Main configuration for Auth Kit
 */
export interface AuthKitConfig {
    /** Google OAuth configuration */
    google?: GoogleOAuthConfig;
    /** Facebook OAuth configuration */
    facebook?: FacebookOAuthConfig;
    /** Telegram authentication configuration */
    telegram?: TelegramConfig;
    /** 
     * Callback invoked after successful authentication
     * @param profile - Normalized user profile
     * @param req - Request object (Express)
     * @returns Object containing the authentication token
     */
    onLogin: (profile: NormalizedProfile, req: unknown) => Promise<{ token: string }>;
}

// =============================================================================
// OAuth State & PKCE
// =============================================================================

/**
 * OAuth state stored in session
 */
export interface OAuthState {
    /** Random state value for CSRF protection */
    state: string;
    /** PKCE code verifier (if using PKCE) */
    codeVerifier?: string;
    /** Provider that initiated the flow */
    provider: Provider;
    /** Timestamp when state was created */
    createdAt: number;
    /** Optional redirect URL after authentication */
    returnTo?: string;
}

/**
 * OAuth callback parameters
 */
export interface OAuthCallbackParams {
    /** Authorization code from provider */
    code: string;
    /** State parameter for CSRF validation */
    state: string;
    /** Error from provider (if any) */
    error?: string;
    /** Error description from provider */
    errorDescription?: string;
}

// =============================================================================
// Response Types
// =============================================================================

/**
 * Authentication result returned to the client
 */
export interface AuthResult {
    /** Whether authentication was successful */
    success: boolean;
    /** Authentication token (if successful) */
    token?: string;
    /** Normalized user profile (if successful) */
    profile?: NormalizedProfile;
    /** Error message (if failed) */
    error?: string;
}

// =============================================================================
// Button Configuration
// =============================================================================

/**
 * Available providers for frontend buttons
 */
export type ButtonProvider = 'google' | 'facebook' | 'telegram';

/**
 * Configuration for auth buttons
 */
export interface AuthButtonConfig {
    /** Provider type */
    provider: ButtonProvider;
    /** Button label */
    label: string;
    /** URL to start OAuth flow */
    authUrl: string;
    /** Icon name or URL */
    icon?: string;
    /** Custom CSS class */
    className?: string;
}

// =============================================================================
// Frontend Configuration
// =============================================================================

/**
 * Frontend-only configuration (no secrets)
 */
export interface FrontendConfig {
    /** Base URL of your auth server */
    authServerUrl: string;
    /** Enabled providers */
    providers: ButtonProvider[];
    /** Custom redirect path after login */
    redirectPath?: string;
}
