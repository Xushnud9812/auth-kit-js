/**
 * Auth-Kit-JS: Facebook OAuth URL Builder
 * 
 * Constructs Facebook OAuth authorization URLs
 */

import { buildUrl } from '../../core/utils.js';
import type { FacebookAuthUrlParams, FacebookConfig } from './types.js';

/** Facebook OAuth endpoints */
export const FACEBOOK_ENDPOINTS = {
    authorization: 'https://www.facebook.com/v18.0/dialog/oauth',
    token: 'https://graph.facebook.com/v18.0/oauth/access_token',
    userinfo: 'https://graph.facebook.com/v18.0/me',
    debug: 'https://graph.facebook.com/debug_token',
} as const;

/** Default scopes for Facebook OAuth */
export const FACEBOOK_DEFAULT_SCOPES = [
    'email',
    'public_profile',
];

/**
 * Build Facebook OAuth authorization URL
 * 
 * @param params - Authorization URL parameters
 * @returns Full authorization URL
 */
export function buildFacebookAuthUrl(params: FacebookAuthUrlParams): string {
    const {
        clientId,
        redirectUri,
        scopes = FACEBOOK_DEFAULT_SCOPES,
        state,
        responseType = 'code',
        authType,
        display,
    } = params;

    const urlParams: Record<string, string | undefined> = {
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: responseType,
        scope: scopes.join(','),
        state,
        auth_type: authType,
        display,
    };

    return buildUrl(FACEBOOK_ENDPOINTS.authorization, urlParams);
}

/**
 * Create a helper for building Facebook OAuth URLs with preset config
 * 
 * @param config - Facebook OAuth configuration
 * @returns Function that builds auth URLs with just state
 */
export function createFacebookOAuthHelper(config: FacebookConfig) {
    return {
        /**
         * Build authorization URL
         */
        buildAuthUrl(state: string): string {
            return buildFacebookAuthUrl({
                clientId: config.clientId,
                redirectUri: config.redirectUri,
                scopes: config.scopes || FACEBOOK_DEFAULT_SCOPES,
                state,
                authType: config.authType,
                display: config.display,
            });
        },

        /**
         * Get configured scopes
         */
        getScopes(): string[] {
            return config.scopes || FACEBOOK_DEFAULT_SCOPES;
        },
    };
}
