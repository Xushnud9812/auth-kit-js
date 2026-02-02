# Telegram WebApp Example

Telegram Mini App authentication.

## HTML Setup

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./main.js"></script>
  </body>
</html>
```

## Main Script

```typescript
import {
  isTelegramWebApp,
  getTelegramInitData,
  getTelegramUser,
  initTelegramWebApp,
  expandTelegramWebApp,
} from "auth-kit-js/frontend";

// Check if in Telegram
if (!isTelegramWebApp()) {
  document.body.innerHTML = "<h1>Open in Telegram</h1>";
} else {
  // Initialize
  initTelegramWebApp();
  expandTelegramWebApp();

  // Get user (for display only)
  const user = getTelegramUser();
  console.log("Hello,", user?.first_name);

  // Verify with backend
  const response = await fetch("/auth/telegram/webapp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      initData: getTelegramInitData(),
    }),
  });

  const { success, token } = await response.json();

  if (success) {
    console.log("Authenticated!", token);
  }
}
```

## Backend Handler

```typescript
import { createAuthRouter } from "auth-kit-js/express";

const auth = createAuthRouter({
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN!,
    authDateTTL: 86400, // 24 hours
  },
  async onLogin(profile) {
    // profile.providerUserId = Telegram user ID
    // profile.name = First + Last name
    return { token: createJWT(profile) };
  },
});
```

## Theme Colors

```typescript
import { getTelegramTheme } from "auth-kit-js/frontend";

const theme = getTelegramTheme();
// {
//   bg_color: '#ffffff',
//   text_color: '#000000',
//   button_color: '#3390ec',
//   ...
// }
```
