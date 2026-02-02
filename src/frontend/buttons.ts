/**
 * Auth-Kit-JS: Frontend Button Helper
 * 
 * Generate authentication button configurations for the frontend
 */

import type { AuthButtonConfig, ButtonProvider, FrontendConfig } from '../core/types.js';

/**
 * Default button labels
 */
const DEFAULT_LABELS: Record<ButtonProvider, string> = {
    google: 'Continue with Google',
    facebook: 'Continue with Facebook',
    telegram: 'Continue with Telegram',
};

/**
 * Default button icons (icon names or URLs)
 */
const DEFAULT_ICONS: Record<ButtonProvider, string> = {
    google: 'google',
    facebook: 'facebook',
    telegram: 'telegram',
};

/**
 * Get authentication button configurations
 * 
 * @param config - Frontend configuration
 * @returns Array of button configurations
 */
export function getAuthButtons(config: FrontendConfig): AuthButtonConfig[] {
    const { authServerUrl, providers, redirectPath = '/auth/callback' } = config;

    return providers.map((provider) => ({
        provider,
        label: DEFAULT_LABELS[provider],
        authUrl: `${authServerUrl}/auth/${provider}`,
        icon: DEFAULT_ICONS[provider],
        className: `auth-button auth-button--${provider}`,
    }));
}

/**
 * Get a single button configuration
 * 
 * @param provider - The provider
 * @param authServerUrl - Base URL of auth server
 * @returns Button configuration
 */
export function getAuthButton(
    provider: ButtonProvider,
    authServerUrl: string
): AuthButtonConfig {
    return {
        provider,
        label: DEFAULT_LABELS[provider],
        authUrl: `${authServerUrl}/auth/${provider}`,
        icon: DEFAULT_ICONS[provider],
        className: `auth-button auth-button--${provider}`,
    };
}

/**
 * Create a customizable button helper
 * 
 * @param config - Frontend configuration
 * @returns Object with button helper methods
 */
export function createButtonHelper(config: FrontendConfig) {
    return {
        /**
         * Get all configured buttons
         */
        getButtons(): AuthButtonConfig[] {
            return getAuthButtons(config);
        },

        /**
         * Get a specific button
         */
        getButton(provider: ButtonProvider): AuthButtonConfig | undefined {
            if (!config.providers.includes(provider)) {
                return undefined;
            }
            return getAuthButton(provider, config.authServerUrl);
        },

        /**
         * Check if a provider is enabled
         */
        isEnabled(provider: ButtonProvider): boolean {
            return config.providers.includes(provider);
        },
    };
}
