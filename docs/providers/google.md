# Google OAuth

Full Google OAuth2/OpenID Connect integration with ID token verification.

## Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google+ API"
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Add authorized redirect URIs

## Configuration

```typescript
import { createAuthRouter } from "auth-kit-js/express";

const authRouter = createAuthRouter({
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: "http://localhost:3000/auth/google/callback",
    scopes: ["openid", "email", "profile"], // optional
  },
  async onLogin(profile) {
    return { token: createToken(profile) };
  },
});
```

## Routes Created

| Route                  | Description      |
| ---------------------- | ---------------- |
| `GET /google`          | Start OAuth flow |
| `GET /google/callback` | Handle callback  |

## PKCE Support

PKCE (Proof Key for Code Exchange) is enabled by default:

```typescript
createAuthRouter({
  google: { ... },
  usePKCE: true, // default
});
```

## Custom Scopes

```typescript
google: {
  clientId: '...',
  clientSecret: '...',
  redirectUri: '...',
  scopes: [
    'openid',
    'email',
    'profile',
    'https://www.googleapis.com/auth/calendar.readonly',
  ],
}
```

## Frontend Usage

```typescript
import { startOAuth } from "auth-kit-js/frontend";

startOAuth({
  provider: "google",
  clientId: process.env.GOOGLE_CLIENT_ID,
  redirectUri: "http://localhost:3000/auth/google/callback",
  usePKCE: true,
});
```

## Profile Data

```typescript
interface NormalizedProfile {
  provider: "google";
  providerUserId: string; // Google user ID
  email: string; // User's email
  name: string; // Full name
  avatarUrl: string; // Profile picture URL
  raw: GoogleIdToken; // Original ID token claims
}
```
