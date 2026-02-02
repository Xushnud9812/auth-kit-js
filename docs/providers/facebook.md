# Facebook OAuth

Facebook OAuth2 integration with Graph API profile fetching.

## Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" product
4. Configure OAuth settings and redirect URIs

## Configuration

```typescript
import { createAuthRouter } from "auth-kit-js/express";

const authRouter = createAuthRouter({
  facebook: {
    clientId: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
    redirectUri: "http://localhost:3000/auth/facebook/callback",
    scopes: ["email", "public_profile"], // optional
  },
  async onLogin(profile) {
    return { token: createToken(profile) };
  },
});
```

## Routes Created

| Route                    | Description      |
| ------------------------ | ---------------- |
| `GET /facebook`          | Start OAuth flow |
| `GET /facebook/callback` | Handle callback  |

## Frontend Usage

```typescript
import { startOAuth } from "auth-kit-js/frontend";

startOAuth({
  provider: "facebook",
  clientId: process.env.FACEBOOK_APP_ID,
  redirectUri: "http://localhost:3000/auth/facebook/callback",
});
```

## Profile Data

```typescript
interface NormalizedProfile {
  provider: "facebook";
  providerUserId: string; // Facebook user ID
  email?: string; // User's email (if granted)
  name: string; // Full name
  avatarUrl: string; // Profile picture URL
  raw: FacebookProfile; // Original Graph API response
}
```

## Custom Scopes

```typescript
facebook: {
  clientId: '...',
  clientSecret: '...',
  redirectUri: '...',
  scopes: [
    'email',
    'public_profile',
    'user_birthday',
  ],
}
```

::: warning
Some scopes require app review before production use.
:::
