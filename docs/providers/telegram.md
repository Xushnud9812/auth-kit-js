# Telegram Authentication

Support for both Telegram WebApp (Mini App) and Login Widget authentication.

## WebApp (Mini App)

For Telegram Mini Apps running inside the Telegram client.

### Backend Setup

```typescript
import { createAuthRouter } from "auth-kit-js/express";

const authRouter = createAuthRouter({
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN!,
    authDateTTL: 86400, // 24 hours (optional)
  },
  async onLogin(profile) {
    return { token: createToken(profile) };
  },
});
```

### Frontend (in Telegram WebApp)

```typescript
import {
  isTelegramWebApp,
  getTelegramInitData,
  initTelegramWebApp,
} from "auth-kit-js/frontend";

if (isTelegramWebApp()) {
  initTelegramWebApp();

  const initData = getTelegramInitData();

  // Send to backend for verification
  const response = await fetch("/auth/telegram/webapp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData }),
  });
}
```

## Login Widget

For web pages using the Telegram Login Widget.

### HTML Widget

```html
<script
  async
  src="https://telegram.org/js/telegram-widget.js?22"
  data-telegram-login="YOUR_BOT_NAME"
  data-size="large"
  data-onauth="onTelegramAuth(user)"
  data-request-access="write"
></script>

<script>
  function onTelegramAuth(user) {
    fetch("/auth/telegram/widget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
  }
</script>
```

### Routes Created

| Route                           | Description              |
| ------------------------------- | ------------------------ |
| `POST /telegram/webapp`         | Verify WebApp initData   |
| `POST /telegram/widget`         | Verify Login Widget data |
| `GET /telegram/widget/callback` | Redirect mode callback   |

## Security

Telegram verification uses **HMAC-SHA256**:

1. Creates secret key from SHA256(botToken)
2. Computes HMAC of data-check-string
3. Compares with provided hash using timing-safe comparison
4. Validates auth_date TTL (default: 24 hours)

## Profile Data

```typescript
interface NormalizedProfile {
  provider: "telegram";
  providerUserId: string; // Telegram user ID
  name: string; // First + Last name
  avatarUrl?: string; // Photo URL (if available)
  raw: TelegramInitData; // Original data
}
```

::: tip
Telegram **does not** provide user email addresses.
:::
