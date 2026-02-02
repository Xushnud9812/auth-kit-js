# Backend API

Node.js-only verification and callback handlers.

## OAuth Handlers

### handleOAuthCallback

Handle OAuth callback with state validation.

```typescript
import { handleOAuthCallback } from "auth-kit-js/backend";

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
import { createOAuthHandler } from "auth-kit-js/backend";

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

## Telegram Verification

### verifyTelegramWebApp

Verify Telegram WebApp initData.

```typescript
import { verifyTelegramWebApp } from "auth-kit-js/backend";

const profile = await verifyTelegramWebApp(
  initData,
  process.env.TELEGRAM_BOT_TOKEN!,
  { authDateTTL: 86400 },
);
```

### verifyTelegramLoginWidget

Verify Login Widget callback.

```typescript
import { verifyTelegramLoginWidget } from "auth-kit-js/backend";

const profile = await verifyTelegramLoginWidget(
  widgetData,
  process.env.TELEGRAM_BOT_TOKEN!,
);
```

### createTelegramHandler

Create reusable Telegram handler.

```typescript
import { createTelegramHandler } from "auth-kit-js/backend";

const telegram = createTelegramHandler(process.env.TELEGRAM_BOT_TOKEN!, {
  authDateTTL: 86400,
});

const profile = await telegram.verifyWebApp(initData);
const profile2 = await telegram.verifyWidget(widgetData);
```
