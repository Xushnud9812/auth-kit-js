# Backend API

Node.js-only verification and callback handlers.

## OAuth Handlers

### handleOAuthCallback

Handle OAuth callback with state validation.

```typescript
import { handleOAuthCallback } from "@xushnud_bek/auth-kit-js/backend";

const profile = await handleOAuthCallback({
  provider: "google",
  code: authorizationCode,
  state: callbackState,
  expectedState: sessionState,
  codeVerifier: pkceVerifier,
  config: googleConfig,
});
```

### createOAuthHandler

Create reusable OAuth handler.

```typescript
import { createOAuthHandler } from "@xushnud_bek/auth-kit-js/backend";

const oauth = createOAuthHandler({
  google: googleConfig,
  facebook: facebookConfig,
});

const profile = await oauth.handleCallback(
  "google",
  code,
  state,
  expectedState,
  codeVerifier,
);
```

## Telegram OAuth Verification

### verifyTelegramOAuth

Verify Telegram OAuth callback data.

```typescript
import { verifyTelegramOAuth } from "@xushnud_bek/auth-kit-js/backend";

const profile = await verifyTelegramOAuth(
  authData, // TelegramOAuthData from frontend
  process.env.TELEGRAM_BOT_TOKEN!,
  { authDateTTL: 86400 }, // 24 hours
);
```

### createTelegramHandler

Create reusable Telegram handler.

```typescript
import { createTelegramHandler } from "@xushnud_bek/auth-kit-js/backend";

const telegram = createTelegramHandler({
  botToken: process.env.TELEGRAM_BOT_TOKEN!,
  authDateTTL: 86400,
});

const profile = await telegram.verify(authData);
```

## Types

```typescript
interface TelegramOAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface NormalizedProfile {
  provider: "google" | "facebook" | "telegram";
  providerUserId: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  raw: unknown;
}
```
