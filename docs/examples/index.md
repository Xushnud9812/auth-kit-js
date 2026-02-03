# Examples

Code examples for common use cases.

## Pages

- [Express Backend](/examples/express) - Full Express.js server
- [React Frontend](/examples/react) - React/Vue integration

## Quick Examples

### Express + All Providers

```typescript
import express from "express";
import session from "express-session";
import { createAuthRouter } from "@xushnud_bek/auth-kit-js/express";

const app = express();
app.use(express.json());
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));

app.use(
  "/auth",
  createAuthRouter({
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectUri: "http://localhost:3000/auth/google/callback",
    },
    facebook: {
      clientId: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
      redirectUri: "http://localhost:3000/auth/facebook/callback",
    },
    telegram: {
      botToken: process.env.TELEGRAM_BOT_TOKEN!,
    },
    async onLogin(profile) {
      return { token: "jwt-token" };
    },
  }),
);

app.listen(3000);
```

### Frontend OAuth Buttons

```typescript
import { startOAuth } from "@xushnud_bek/auth-kit-js/frontend";
import { startTelegramOAuth } from "@xushnud_bek/auth-kit-js/frontend";

// Google
document.getElementById("google-btn").onclick = () => {
  startOAuth({
    provider: "google",
    clientId: "your-client-id",
    redirectUri: "http://localhost:3000/auth/google/callback",
  });
};

// Telegram
document.getElementById("telegram-btn").onclick = () => {
  startTelegramOAuth({
    botId: "5323903014",
    redirectUri: "http://localhost:3000/auth/telegram/callback",
  });
};
```

### Telegram OAuth Callback

```typescript
import { handleTelegramOAuthCallback } from "@xushnud_bek/auth-kit-js/frontend";

// On callback page
const authData = handleTelegramOAuthCallback();
if (authData) {
  fetch("/auth/telegram/oauth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(authData),
  });
}
```
