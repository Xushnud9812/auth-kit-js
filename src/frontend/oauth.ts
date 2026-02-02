/**
 * Auth-Kit-JS: Frontend OAuth Helper
 * 
 * Browser-side OAuth flow initiation with state management
 */

import { generateState, generateCodeVerifier, generateCodeChallenge } from '../core/crypto.js';
import { buildGoogleAuthUrl, GOOGLE_DEFAULT_SCOPES } from '../providers/google/oauth.js';
import { buildFacebookAuthUrl, FACEBOOK_DEFAULT_SCOPES } from '../providers/facebook/oauth.js';
import type { OAuthState, Provider } from '../core/types.js';

/** Storage key for OAuth state */
const STATE_STORAGE_KEY = 'auth_kit_oauth_state';

/**
 * OAuth start options
 */
export interface StartOAuthOptions {
    /** Provider to authenticate with */
    provider: 'google' | 'facebook';
    /** OAuth client ID */
    clientId: string;
    /** Redirect URI for callback */
    redirectUri: string;
    /** Scopes to request */
    scopes?: string[];
    /** Use PKCE (recommended for Google) */
    usePKCE?: boolean;
    /** URL to return to after auth */
    returnTo?: string;
}

/**
 * Store OAuth state in sessionStorage
 */
function storeOAuthState(state: OAuthState): void {
    if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(state));
    }
}

/**
 * Retrieve and clear OAuth state from sessionStorage
 */
export function retrieveOAuthState(): OAuthState | null {
    if (typeof sessionStorage === 'undefined') {
        return null;
    }

    const stored = sessionStorage.getItem(STATE_STORAGE_KEY);
    if (!stored) {
        return null;
    }

    sessionStorage.removeItem(STATE_STORAGE_KEY);

    try {
        return JSON.parse(stored) as OAuthState;
    } catch {
        return null;
    }
}

/**
 * Validate OAuth callback state
 * 
 * @param receivedState - State parameter from callback
 * @returns True if state matches
 */
export function validateState(receivedState: string): boolean {
    const stored = retrieveOAuthState();
    if (!stored) {
        return false;
    }

    return stored.state === receivedState;
}

/**
 * Start OAuth flow
 * Generates state, stores it, and redirects to provider
 * 
 * @param options - OAuth start options
 */
export async function startOAuth(options: StartOAuthOptions): Promise<void> {
    const {
        provider,
        clientId,
        redirectUri,
        scopes,
        usePKCE = provider === 'google', // Default PKCE for Google
        returnTo = window.location.href,
    } = options;

    // Generate state
    const state = generateState();

    // Generate PKCE if enabled
    let codeVerifier: string | undefined;
    let codeChallenge: string | undefined;

    if (usePKCE) {
        codeVerifier = generateCodeVerifier();
        codeChallenge = await generateCodeChallenge(codeVerifier);
    }

    // Store state
    const oauthState: OAuthState = {
        state,
        codeVerifier,
        provider,
        createdAt: Date.now(),
        returnTo,
    };
    storeOAuthState(oauthState);

    // Build authorization URL
    let authUrl: string;

    if (provider === 'google') {
        authUrl = buildGoogleAuthUrl({
            clientId,
            redirectUri,
            scopes: scopes || GOOGLE_DEFAULT_SCOPES,
            state,
            codeChallenge,
            codeChallengeMethod: codeChallenge ? 'S256' : undefined,
        });
    } else if (provider === 'facebook') {
        authUrl = buildFacebookAuthUrl({
            clientId,
            redirectUri,
            scopes: scopes || FACEBOOK_DEFAULT_SCOPES,
            state,
        });
    } else {
        throw new Error(`Unknown provider: ${provider}`);
    }

    // Redirect to provider
    window.location.href = authUrl;
}

/**
 * Start OAuth flow in a popup window
 * 
 * @param options - OAuth start options
 * @param popupOptions - Popup window options
 * @returns Promise that resolves when popup closes
 */
export async function startOAuthPopup(
    options: StartOAuthOptions,
    popupOptions: {
        width?: number;
        height?: number;
        name?: string;
    } = {}
): Promise<void> {
    const { width = 500, height = 600, name = 'auth_popup' } = popupOptions;

    // Calculate popup position
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    // We need to build the URL without redirecting
    const state = generateState();
    let codeVerifier: string | undefined;
    let codeChallenge: string | undefined;

    if (options.usePKCE ?? options.provider === 'google') {
        codeVerifier = generateCodeVerifier();
        codeChallenge = await generateCodeChallenge(codeVerifier);
    }

    // Store state
    const oauthState: OAuthState = {
        state,
        codeVerifier,
        provider: options.provider,
        createdAt: Date.now(),
        returnTo: options.returnTo || window.location.href,
    };
    storeOAuthState(oauthState);

    // Build URL
    let authUrl: string;
    if (options.provider === 'google') {
        authUrl = buildGoogleAuthUrl({
            clientId: options.clientId,
            redirectUri: options.redirectUri,
            scopes: options.scopes || GOOGLE_DEFAULT_SCOPES,
            state,
            codeChallenge,
            codeChallengeMethod: codeChallenge ? 'S256' : undefined,
        });
    } else {
        authUrl = buildFacebookAuthUrl({
            clientId: options.clientId,
            redirectUri: options.redirectUri,
            scopes: options.scopes || FACEBOOK_DEFAULT_SCOPES,
            state,
        });
    }

    // Open popup
    const popup = window.open(
        authUrl,
        name,
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
    );

    if (!popup) {
        throw new Error('Failed to open popup window');
    }

    // Return promise that resolves when popup closes
    return new Promise((resolve, reject) => {
        const checkClosed = setInterval(() => {
            if (popup.closed) {
                clearInterval(checkClosed);
                resolve();
            }
        }, 500);
    });
}
