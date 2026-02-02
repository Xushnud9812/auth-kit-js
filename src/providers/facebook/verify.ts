/**
 * Auth-Kit-JS: Facebook Token Verification
 * 
 * Exchange authorization codes and fetch Facebook profiles
 * (Node.js only)
 */

import { CodeExchangeError, OAuthError } from '../../core/errors.js';
import { createNormalizedProfile } from '../../core/utils.js';
import type { NormalizedProfile } from '../../core/types.js';
import type { FacebookConfig, FacebookTokenResponse, FacebookUserProfile, FacebookErrorResponse } from './types.js';
import { FACEBOOK_ENDPOINTS } from './oauth.js';

/**
 * Exchange authorization code for access token
 * 
 * @param code - Authorization code from callback
 * @param config - Facebook OAuth configuration
 * @returns Token response
 */
export async function exchangeFacebookCode(
    code: string,
    config: FacebookConfig
): Promise<FacebookTokenResponse> {
    const url = new URL(FACEBOOK_ENDPOINTS.token);
    url.searchParams.append('client_id', config.clientId);
    url.searchParams.append('client_secret', config.clientSecret);
    url.searchParams.append('redirect_uri', config.redirectUri);
    url.searchParams.append('code', code);

    const response = await fetch(url.toString());

    if (!response.ok) {
        const error = await response.json() as FacebookErrorResponse;
        throw new CodeExchangeError('facebook', error.error?.message || 'Token exchange failed');
    }

    return response.json() as Promise<FacebookTokenResponse>;
}

/**
 * Fetch user profile from Facebook Graph API
 * 
 * @param accessToken - Access token
 * @param fields - Fields to request (default: id,name,email,picture)
 * @returns User profile
 */
export async function fetchFacebookProfile(
    accessToken: string,
    fields: string[] = ['id', 'name', 'email', 'first_name', 'last_name', 'picture.type(large)']
): Promise<FacebookUserProfile> {
    const url = new URL(FACEBOOK_ENDPOINTS.userinfo);
    url.searchParams.append('access_token', accessToken);
    url.searchParams.append('fields', fields.join(','));

    const response = await fetch(url.toString());

    if (!response.ok) {
        const error = await response.json() as FacebookErrorResponse;
        throw new OAuthError(
            error.error?.message || 'Failed to fetch Facebook profile',
            'facebook',
            'PROFILE_FETCH_FAILED'
        );
    }

    return response.json() as Promise<FacebookUserProfile>;
}

/**
 * Complete Facebook OAuth flow and get normalized profile
 * 
 * @param code - Authorization code from callback
 * @param config - Facebook OAuth configuration
 * @returns Normalized user profile
 */
export async function handleFacebookCallback(
    code: string,
    config: FacebookConfig
): Promise<NormalizedProfile> {
    // Exchange code for token
    const tokens = await exchangeFacebookCode(code, config);

    // Fetch user profile
    const profile = await fetchFacebookProfile(tokens.access_token);

    return normalizeFacebookProfile(profile, { tokens, profile });
}

/**
 * Normalize Facebook profile to standard format
 */
export function normalizeFacebookProfile(
    profile: FacebookUserProfile,
    raw: unknown
): NormalizedProfile {
    // Extract avatar URL from picture data
    const avatarUrl = profile.picture?.data?.url;

    // Build full name from parts if name is not available
    const name = profile.name ||
        [profile.first_name, profile.last_name].filter(Boolean).join(' ') ||
        undefined;

    return createNormalizedProfile('facebook', profile.id, {
        email: profile.email,
        name,
        avatarUrl,
        raw,
    });
}
