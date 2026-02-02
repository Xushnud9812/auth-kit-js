/**
 * Auth-Kit-JS: Express Adapter
 * 
 * High-level Express.js integration for authentication
 */

import { generateState, generateCodeVerifier, generateCodeChallenge } from '../../core/crypto.js';
import { buildGoogleAuthUrl, GOOGLE_DEFAULT_SCOPES } from '../../providers/google/oauth.js';
import { buildFacebookAuthUrl, FACEBOOK_DEFAULT_SCOPES } from '../../providers/facebook/oauth.js';
import { handleGoogleCallback } from '../../providers/google/verify.js';
import { handleFacebookCallback } from '../../providers/facebook/verify.js';
import { verifyTelegramWebApp } from '../../providers/telegram/webapp.js';
import { verifyTelegramLoginWidget } from '../../providers/telegram/widget.js';
import { AuthKitError, InvalidStateError } from '../../core/errors.js';
import type { NormalizedProfile, GoogleOAuthConfig, FacebookOAuthConfig, TelegramConfig } from '../../core/types.js';

// Use dynamic import / require for express to allow it to be optional
type ExpressRouter = ReturnType<typeof import('express').Router>;
type ExpressRequest = import('express').Request & {
    session?: Record<string, unknown>;
    body?: Record<string, unknown>;
    query: Record<string, unknown>;
};
type ExpressResponse = import('express').Response;

/**
 * Auth router configuration
 */
export interface AuthRouterConfig {
    /** Google OAuth configuration */
    google?: GoogleOAuthConfig;
    /** Facebook OAuth configuration */
    facebook?: FacebookOAuthConfig;
    /** Telegram configuration */
    telegram?: TelegramConfig;
    /**
     * Callback after successful authentication
     * Return a token to send to the client
     */
    onLogin: (profile: NormalizedProfile, req: unknown) => Promise<{ token: string }>;
    /**
     * Error handler (optional)
     * Default: sends JSON error response
     */
    onError?: (error: Error, req: unknown, res: unknown) => void;
    /**
     * Success redirect URL (optional)
     * If set, redirects instead of sending JSON
     */
    successRedirect?: string;
    /**
     * Error redirect URL (optional)
     * If set, redirects on error instead of sending JSON
     */
    errorRedirect?: string;
    /**
     * Use PKCE for Google OAuth (default: true)
     */
    usePKCE?: boolean;
    /**
     * Cookie options for session
     */
    cookieOptions?: {
        httpOnly?: boolean;
        secure?: boolean;
        sameSite?: 'strict' | 'lax' | 'none';
        maxAge?: number;
    };
}

/**
 * Default cookie options (secure by default)
 */
const DEFAULT_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * Create Express auth router
 * 
 * Routes created:
 * - GET /google - Start Google OAuth
 * - GET /google/callback - Handle Google callback
 * - GET /facebook - Start Facebook OAuth
 * - GET /facebook/callback - Handle Facebook callback
 * - POST /telegram/webapp - Verify Telegram WebApp
 * - POST /telegram/widget - Verify Telegram Login Widget
 * 
 * @param config - Router configuration
 * @returns Express Router
 */
export function createAuthRouter(config: AuthRouterConfig): ExpressRouter {
    // Dynamic require of express - allows this to work even without express installed
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const express = require('express');
    const router = express.Router() as ExpressRouter;
    const { usePKCE = true, cookieOptions = DEFAULT_COOKIE_OPTIONS } = config;

    // Error handler helper
    const handleError = (error: Error, req: ExpressRequest, res: ExpressResponse) => {
        if (config.onError) {
            return config.onError(error, req, res);
        }

        if (config.errorRedirect) {
            const url = new URL(config.errorRedirect, `${req.protocol}://${req.get?.('host') || 'localhost'}`);
            url.searchParams.set('error', error.message);
            return res.redirect(url.toString());
        }

        const statusCode = error instanceof AuthKitError ? error.statusCode : 500;
        res.status(statusCode).json({
            success: false,
            error: error.message,
            code: error instanceof AuthKitError ? error.code : 'INTERNAL_ERROR',
        });
    };

    // Success handler helper
    const handleSuccess = async (profile: NormalizedProfile, req: ExpressRequest, res: ExpressResponse) => {
        try {
            const { token } = await config.onLogin(profile, req);

            if (config.successRedirect) {
                // Set token in cookie and redirect
                res.cookie('auth_token', token, cookieOptions);
                return res.redirect(config.successRedirect);
            }

            // Send JSON response
            res.json({
                success: true,
                token,
                profile: {
                    provider: profile.provider,
                    providerUserId: profile.providerUserId,
                    email: profile.email,
                    name: profile.name,
                    avatarUrl: profile.avatarUrl,
                },
            });
        } catch (error) {
            handleError(error instanceof Error ? error : new Error(String(error)), req, res);
        }
    };

    // Helper to get/set session data
    const getSession = (req: ExpressRequest): Record<string, unknown> => {
        if (!req.session) {
            req.session = {};
        }
        return req.session;
    };

    // ==========================================================================
    // Google OAuth
    // ==========================================================================

    if (config.google) {
        // Start Google OAuth
        router.get('/google', async (req: ExpressRequest, res: ExpressResponse) => {
            try {
                const state = generateState();
                let codeChallenge: string | undefined;
                let codeVerifier: string | undefined;

                if (usePKCE) {
                    codeVerifier = generateCodeVerifier();
                    codeChallenge = await generateCodeChallenge(codeVerifier);
                }

                // Store state in session
                const session = getSession(req);
                session.oauthState = state;
                session.codeVerifier = codeVerifier;
                session.returnTo = req.query.returnTo as string;

                const authUrl = buildGoogleAuthUrl({
                    clientId: config.google!.clientId,
                    redirectUri: config.google!.redirectUri,
                    scopes: config.google!.scopes || GOOGLE_DEFAULT_SCOPES,
                    state,
                    codeChallenge,
                    codeChallengeMethod: codeChallenge ? 'S256' : undefined,
                });

                res.redirect(authUrl);
            } catch (error) {
                handleError(error instanceof Error ? error : new Error(String(error)), req, res);
            }
        });

        // Handle Google callback
        router.get('/google/callback', async (req: ExpressRequest, res: ExpressResponse) => {
            try {
                const { code, state, error: oauthError } = req.query;

                if (oauthError) {
                    throw new AuthKitError(String(oauthError), 'OAUTH_ERROR');
                }

                if (!code || typeof code !== 'string') {
                    throw new AuthKitError('Missing authorization code', 'MISSING_CODE');
                }

                // Validate state
                const session = getSession(req);
                const expectedState = session.oauthState;
                if (!expectedState || state !== expectedState) {
                    throw new InvalidStateError('google');
                }

                const codeVerifier = session.codeVerifier as string | undefined;

                // Clear session state
                delete session.oauthState;
                delete session.codeVerifier;

                // Exchange code for profile
                const profile = await handleGoogleCallback(
                    code,
                    config.google!,
                    codeVerifier
                );

                await handleSuccess(profile, req, res);
            } catch (error) {
                handleError(error instanceof Error ? error : new Error(String(error)), req, res);
            }
        });
    }

    // ==========================================================================
    // Facebook OAuth
    // ==========================================================================

    if (config.facebook) {
        // Start Facebook OAuth
        router.get('/facebook', (req: ExpressRequest, res: ExpressResponse) => {
            try {
                const state = generateState();

                // Store state in session
                const session = getSession(req);
                session.oauthState = state;
                session.returnTo = req.query.returnTo as string;

                const authUrl = buildFacebookAuthUrl({
                    clientId: config.facebook!.clientId,
                    redirectUri: config.facebook!.redirectUri,
                    scopes: config.facebook!.scopes || FACEBOOK_DEFAULT_SCOPES,
                    state,
                });

                res.redirect(authUrl);
            } catch (error) {
                handleError(error instanceof Error ? error : new Error(String(error)), req, res);
            }
        });

        // Handle Facebook callback
        router.get('/facebook/callback', async (req: ExpressRequest, res: ExpressResponse) => {
            try {
                const { code, state, error: oauthError } = req.query;

                if (oauthError) {
                    throw new AuthKitError(String(oauthError), 'OAUTH_ERROR');
                }

                if (!code || typeof code !== 'string') {
                    throw new AuthKitError('Missing authorization code', 'MISSING_CODE');
                }

                // Validate state
                const session = getSession(req);
                const expectedState = session.oauthState;
                if (!expectedState || state !== expectedState) {
                    throw new InvalidStateError('facebook');
                }

                // Clear session state
                delete session.oauthState;

                // Exchange code for profile
                const profile = await handleFacebookCallback(code, config.facebook!);

                await handleSuccess(profile, req, res);
            } catch (error) {
                handleError(error instanceof Error ? error : new Error(String(error)), req, res);
            }
        });
    }

    // ==========================================================================
    // Telegram
    // ==========================================================================

    if (config.telegram) {
        // Verify Telegram WebApp
        router.post('/telegram/webapp', async (req: ExpressRequest, res: ExpressResponse) => {
            try {
                const initData = req.body?.initData;

                if (!initData || typeof initData !== 'string') {
                    throw new AuthKitError('Missing initData', 'MISSING_DATA');
                }

                const profile = await verifyTelegramWebApp(
                    initData,
                    config.telegram!.botToken,
                    { authDateTTL: config.telegram!.authDateTTL }
                );

                await handleSuccess(profile, req, res);
            } catch (error) {
                handleError(error instanceof Error ? error : new Error(String(error)), req, res);
            }
        });

        // Verify Telegram Login Widget
        router.post('/telegram/widget', async (req: ExpressRequest, res: ExpressResponse) => {
            try {
                const widgetData = req.body;

                if (!widgetData || !widgetData.id || !widgetData.hash) {
                    throw new AuthKitError('Invalid widget data', 'INVALID_DATA');
                }

                const profile = await verifyTelegramLoginWidget(
                    widgetData as Record<string, string | number | undefined>,
                    config.telegram!.botToken,
                    { authDateTTL: config.telegram!.authDateTTL }
                );

                await handleSuccess(profile, req, res);
            } catch (error) {
                handleError(error instanceof Error ? error : new Error(String(error)), req, res);
            }
        });

        // Alternative: GET endpoint for Login Widget redirect mode
        router.get('/telegram/widget/callback', async (req: ExpressRequest, res: ExpressResponse) => {
            try {
                const widgetData = req.query;

                if (!widgetData || !widgetData.id || !widgetData.hash) {
                    throw new AuthKitError('Invalid widget data', 'INVALID_DATA');
                }

                const profile = await verifyTelegramLoginWidget(
                    widgetData as Record<string, string | number | undefined>,
                    config.telegram!.botToken,
                    { authDateTTL: config.telegram!.authDateTTL }
                );

                await handleSuccess(profile, req, res);
            } catch (error) {
                handleError(error instanceof Error ? error : new Error(String(error)), req, res);
            }
        });
    }

    return router;
}

/**
 * Get list of configured providers
 */
export function getConfiguredProviders(config: AuthRouterConfig): string[] {
    const providers: string[] = [];
    if (config.google) providers.push('google');
    if (config.facebook) providers.push('facebook');
    if (config.telegram) providers.push('telegram');
    return providers;
}
