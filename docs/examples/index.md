# Examples

Code examples for common use cases.

## Pages

- [Express Backend](/examples/express) - Full Express.js server
- [React Frontend](/examples/react) - React/Vue integration
- [Telegram WebApp](/examples/telegram-webapp) - Telegram Mini App

## Quick Examples

### Express + Google OAuth

```typescript
import express from "express";
import session from "express-session";
import { createAuthRouter } from "auth-kit-js/express";

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
    async onLogin(profile) {
      return { token: "jwt-token" };
    },
  }),
);

app.listen(3000);
```

### Frontend OAuth Button

```typescript
import { startOAuth } from "auth-kit-js/frontend";

document.getElementById("login").onclick = () => {
  startOAuth({
    provider: "google",
    clientId: "your-client-id",
    redirectUri: "http://localhost:3000/auth/google/callback",
  });
};
```

### Telegram WebApp

```typescript
import { isTelegramWebApp, getTelegramInitData } from "auth-kit-js/frontend";

if (isTelegramWebApp()) {
  const result = await fetch("/auth/telegram/webapp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData: getTelegramInitData() }),
  }).then((r) => r.json());
}
```
