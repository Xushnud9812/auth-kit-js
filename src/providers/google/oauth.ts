/**
 * Auth-Kit-JS: Google OAuth URL Builder
 * 
 * Constructs Google OAuth authorization URLs with PKCE support
 */

import { buildUrl } from '../../core/utils.js';
import type { GoogleAuthUrlParams, GoogleConfig } from './types.js';

/** Google OAuth endpoints */
export const GOOGLE_ENDPOINTS = {
    authorization: 'https://accounts.google.com/o/oauth2/v2/auth',
    token: 'https://oauth2.googleapis.com/token',
    userinfo: 'https://www.googleapis.com/oauth2/v3/userinfo',
    revoke: 'https://oauth2.googleapis.com/revoke',
} as const;

/** Default scopes for Google OAuth */
export const GOOGLE_DEFAULT_SCOPES = [
    'openid',
    'email',
    'profile',
];

/**
 * Build Google OAuth authorization URL
 * 
 * @param params - Authorization URL parameters
 * @returns Full authorization URL
 */
export function buildGoogleAuthUrl(params: GoogleAuthUrlParams): string {
    const {
        clientId,
        redirectUri,
        scopes = GOOGLE_DEFAULT_SCOPES,
        state,
        codeChallenge,
        codeChallengeMethod,
        responseType = 'code',
        accessType = 'online',
        prompt,
        loginHint,
        hostedDomain,
        includeGrantedScopes,
        nonce,
    } = params;

    const urlParams: Record<string, string | undefined> = {
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: responseType,
        scope: scopes.join(' '),
        state,
        access_type: accessType,
        code_challenge: codeChallenge,
        code_challenge_method: codeChallengeMethod,
        prompt,
        login_hint: loginHint,
        hd: hostedDomain,
        include_granted_scopes: includeGrantedScopes?.toString(),
        nonce,
    };

    return buildUrl(GOOGLE_ENDPOINTS.authorization, urlParams);
}

/**
 * Create a helper for building Google OAuth URLs with preset config
 * 
 * @param config - Google OAuth configuration
 * @returns Function that builds auth URLs with just state and optional code challenge
 */
export function createGoogleOAuthHelper(config: GoogleConfig) {
    return {
        /**
         * Build authorization URL
         */
        buildAuthUrl(state: string, codeChallenge?: string): string {
            return buildGoogleAuthUrl({
                clientId: config.clientId,
                redirectUri: config.redirectUri,
                scopes: config.scopes || GOOGLE_DEFAULT_SCOPES,
                state,
                codeChallenge,
                codeChallengeMethod: codeChallenge ? 'S256' : undefined,
                accessType: config.accessType,
                prompt: config.prompt,
                loginHint: config.loginHint,
                hostedDomain: config.hostedDomain,
                includeGrantedScopes: config.includeGrantedScopes,
            });
        },

        /**
         * Get configured scopes
         */
        getScopes(): string[] {
            return config.scopes || GOOGLE_DEFAULT_SCOPES;
        },
    };
}
