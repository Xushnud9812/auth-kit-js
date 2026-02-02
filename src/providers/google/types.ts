/**
 * Auth-Kit-JS: Google Provider Types
 */

import type { OAuthConfig } from '../../core/types.js';

/**
 * Google OAuth configuration
 */
export interface GoogleConfig extends OAuthConfig {
    /** Enable OpenID Connect (default: true) */
    useOIDC?: boolean;
    /** Hosted domain restriction (for G Suite/Workspace) */
    hostedDomain?: string;
    /** Login hint (email or sub) */
    loginHint?: string;
    /** Access type: 'online' or 'offline' (for refresh tokens) */
    accessType?: 'online' | 'offline';
    /** Prompt behavior */
    prompt?: 'none' | 'consent' | 'select_account';
    /** Include granted scopes */
    includeGrantedScopes?: boolean;
}

/**
 * Google OAuth authorization URL parameters
 */
export interface GoogleAuthUrlParams {
    /** OAuth client ID */
    clientId: string;
    /** Redirect URI */
    redirectUri: string;
    /** Scopes to request */
    scopes?: string[];
    /** State parameter for CSRF protection */
    state: string;
    /** PKCE code challenge */
    codeChallenge?: string;
    /** PKCE code challenge method */
    codeChallengeMethod?: 'S256';
    /** Response type */
    responseType?: 'code';
    /** Access type */
    accessType?: 'online' | 'offline';
    /** Prompt behavior */
    prompt?: 'none' | 'consent' | 'select_account';
    /** Login hint */
    loginHint?: string;
    /** Hosted domain */
    hostedDomain?: string;
    /** Include granted scopes */
    includeGrantedScopes?: boolean;
    /** Nonce for ID token validation */
    nonce?: string;
}

/**
 * Google token response
 */
export interface GoogleTokenResponse {
    /** Access token */
    access_token: string;
    /** Token type (usually 'Bearer') */
    token_type: string;
    /** Expiration time in seconds */
    expires_in: number;
    /** Refresh token (if offline access requested) */
    refresh_token?: string;
    /** Space-separated list of scopes */
    scope: string;
    /** ID token (if openid scope requested) */
    id_token?: string;
}

/**
 * Google ID token claims (decoded)
 */
export interface GoogleIdTokenClaims {
    /** Issuer */
    iss: string;
    /** Subject (user ID) */
    sub: string;
    /** Authorized party */
    azp: string;
    /** Audience (client ID) */
    aud: string;
    /** Issued at (Unix timestamp) */
    iat: number;
    /** Expiration (Unix timestamp) */
    exp: number;
    /** Email address */
    email?: string;
    /** Email verified flag */
    email_verified?: boolean;
    /** Full name */
    name?: string;
    /** Profile picture URL */
    picture?: string;
    /** Given (first) name */
    given_name?: string;
    /** Family (last) name */
    family_name?: string;
    /** Locale */
    locale?: string;
    /** Hosted domain */
    hd?: string;
    /** Nonce (if provided in request) */
    nonce?: string;
}

/**
 * Google user profile from UserInfo endpoint
 */
export interface GoogleUserProfile {
    /** User ID */
    id: string;
    /** Email address */
    email: string;
    /** Email verified flag */
    verified_email: boolean;
    /** Full name */
    name: string;
    /** Given name */
    given_name: string;
    /** Family name */
    family_name?: string;
    /** Profile picture URL */
    picture?: string;
    /** Locale */
    locale?: string;
    /** Hosted domain */
    hd?: string;
}
