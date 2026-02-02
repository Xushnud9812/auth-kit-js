/**
 * Auth-Kit-JS: Google Token Verification
 * 
 * Exchange authorization codes and verify Google tokens
 * (Node.js only)
 */

import { CodeExchangeError, OAuthError } from '../../core/errors.js';
import { createNormalizedProfile } from '../../core/utils.js';
import type { NormalizedProfile } from '../../core/types.js';
import type { GoogleConfig, GoogleTokenResponse, GoogleIdTokenClaims, GoogleUserProfile } from './types.js';
import { GOOGLE_ENDPOINTS } from './oauth.js';

/**
 * Exchange authorization code for tokens
 * 
 * @param code - Authorization code from callback
 * @param config - Google OAuth configuration
 * @param codeVerifier - PKCE code verifier (if using PKCE)
 * @returns Token response
 */
export async function exchangeGoogleCode(
    code: string,
    config: GoogleConfig,
    codeVerifier?: string
): Promise<GoogleTokenResponse> {
    const body = new URLSearchParams({
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri,
        grant_type: 'authorization_code',
    });

    if (codeVerifier) {
        body.append('code_verifier', codeVerifier);
    }

    const response = await fetch(GOOGLE_ENDPOINTS.token, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new CodeExchangeError('google', error);
    }

    return response.json() as Promise<GoogleTokenResponse>;
}

/**
 * Decode a JWT token without verification
 * WARNING: This does NOT verify the signature - use for inspection only
 * 
 * @param token - JWT token string
 * @returns Decoded payload
 */
export function decodeJwt<T = Record<string, unknown>>(token: string): T {
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new OAuthError('Invalid JWT format', 'google', 'INVALID_TOKEN');
    }

    const payload = parts[1];
    // Add padding if needed
    const padded = payload + '='.repeat((4 - payload.length % 4) % 4);
    const decoded = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));

    return JSON.parse(decoded) as T;
}

/**
 * Verify Google ID token claims
 * Note: In production, you should verify the signature using Google's public keys
 * 
 * @param idToken - The ID token to verify
 * @param clientId - Expected client ID
 * @returns Decoded and verified claims
 */
export function verifyGoogleIdToken(
    idToken: string,
    clientId: string
): GoogleIdTokenClaims {
    const claims = decodeJwt<GoogleIdTokenClaims>(idToken);

    // Verify issuer
    if (!['https://accounts.google.com', 'accounts.google.com'].includes(claims.iss)) {
        throw new OAuthError('Invalid issuer in ID token', 'google', 'INVALID_TOKEN');
    }

    // Verify audience
    if (claims.aud !== clientId) {
        throw new OAuthError('Invalid audience in ID token', 'google', 'INVALID_TOKEN');
    }

    // Verify expiration
    const now = Math.floor(Date.now() / 1000);
    if (claims.exp < now) {
        throw new OAuthError('ID token has expired', 'google', 'TOKEN_EXPIRED');
    }

    // Verify issued at (allow 5 minute clock skew)
    if (claims.iat > now + 300) {
        throw new OAuthError('ID token issued in the future', 'google', 'INVALID_TOKEN');
    }

    return claims;
}

/**
 * Fetch user profile from Google UserInfo endpoint
 * 
 * @param accessToken - Access token
 * @returns User profile
 */
export async function fetchGoogleUserProfile(
    accessToken: string
): Promise<GoogleUserProfile> {
    const response = await fetch(GOOGLE_ENDPOINTS.userinfo, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new OAuthError(
            'Failed to fetch Google user profile',
            'google',
            'PROFILE_FETCH_FAILED'
        );
    }

    return response.json() as Promise<GoogleUserProfile>;
}

/**
 * Complete Google OAuth flow and get normalized profile
 * 
 * @param code - Authorization code from callback
 * @param config - Google OAuth configuration
 * @param codeVerifier - PKCE code verifier (if using PKCE)
 * @returns Normalized user profile
 */
export async function handleGoogleCallback(
    code: string,
    config: GoogleConfig,
    codeVerifier?: string
): Promise<NormalizedProfile> {
    // Exchange code for tokens
    const tokens = await exchangeGoogleCode(code, config, codeVerifier);

    let userId: string;
    let email: string | undefined;
    let name: string | undefined;
    let picture: string | undefined;
    let raw: unknown;

    // If we have an ID token, use it (preferred for OIDC)
    if (tokens.id_token) {
        const claims = verifyGoogleIdToken(tokens.id_token, config.clientId);
        userId = claims.sub;
        email = claims.email;
        name = claims.name;
        picture = claims.picture;
        raw = { tokens, claims };
    } else {
        // Fall back to UserInfo endpoint
        const profile = await fetchGoogleUserProfile(tokens.access_token);
        userId = profile.id;
        email = profile.email;
        name = profile.name;
        picture = profile.picture;
        raw = { tokens, profile };
    }

    return createNormalizedProfile('google', userId, {
        email,
        name,
        avatarUrl: picture,
        raw,
    });
}

/**
 * Normalize Google user data to standard profile
 */
export function normalizeGoogleProfile(
    data: GoogleIdTokenClaims | GoogleUserProfile,
    raw: unknown
): NormalizedProfile {
    const isIdToken = 'sub' in data;

    return createNormalizedProfile(
        'google',
        isIdToken ? data.sub : data.id,
        {
            email: data.email,
            name: data.name,
            avatarUrl: isIdToken ? data.picture : data.picture,
            raw,
        }
    );
}
