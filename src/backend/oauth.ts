/**
 * Auth-Kit-JS: Backend OAuth Handler
 * 
 * Server-side OAuth callback handling
 */

import { InvalidStateError, ProviderNotConfiguredError } from '../core/errors.js';
import { handleGoogleCallback } from '../providers/google/verify.js';
import { handleFacebookCallback } from '../providers/facebook/verify.js';
import type { NormalizedProfile, GoogleOAuthConfig, FacebookOAuthConfig } from '../core/types.js';

/**
 * OAuth callback handler options
 */
export interface HandleCallbackOptions {
    /** Provider */
    provider: 'google' | 'facebook';
    /** Authorization code */
    code: string;
    /** State from callback */
    state: string;
    /** Expected state (from session) */
    expectedState: string;
    /** PKCE code verifier (from session) */
    codeVerifier?: string;
    /** Provider configuration */
    config: GoogleOAuthConfig | FacebookOAuthConfig;
}

/**
 * Handle OAuth callback
 * Validates state and exchanges code for profile
 * 
 * @param options - Callback options
 * @returns Normalized user profile
 */
export async function handleOAuthCallback(
    options: HandleCallbackOptions
): Promise<NormalizedProfile> {
    const { provider, code, state, expectedState, codeVerifier, config } = options;

    // Validate state (CSRF protection)
    if (state !== expectedState) {
        throw new InvalidStateError(provider);
    }

    // Handle by provider
    if (provider === 'google') {
        return handleGoogleCallback(code, config as GoogleOAuthConfig, codeVerifier);
    } else if (provider === 'facebook') {
        return handleFacebookCallback(code, config as FacebookOAuthConfig);
    } else {
        throw new ProviderNotConfiguredError(provider);
    }
}

/**
 * OAuth configuration map
 */
export interface OAuthConfigMap {
    google?: GoogleOAuthConfig;
    facebook?: FacebookOAuthConfig;
}

/**
 * Create OAuth handler with pre-configured providers
 */
export function createOAuthHandler(configs: OAuthConfigMap) {
    return {
        /**
         * Check if provider is configured
         */
        isConfigured(provider: 'google' | 'facebook'): boolean {
            return !!configs[provider];
        },

        /**
         * Get provider config
         */
        getConfig(provider: 'google' | 'facebook'): GoogleOAuthConfig | FacebookOAuthConfig | undefined {
            return configs[provider];
        },

        /**
         * Handle callback for a provider
         */
        async handleCallback(
            provider: 'google' | 'facebook',
            code: string,
            state: string,
            expectedState: string,
            codeVerifier?: string
        ): Promise<NormalizedProfile> {
            const config = configs[provider];
            if (!config) {
                throw new ProviderNotConfiguredError(provider);
            }

            return handleOAuthCallback({
                provider,
                code,
                state,
                expectedState,
                codeVerifier,
                config,
            });
        },
    };
}
