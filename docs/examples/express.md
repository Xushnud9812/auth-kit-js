# Express Backend Example

Full Express.js server with all authentication providers.

## Complete Server

```typescript
import express from "express";
import session from "express-session";
import cors from "cors";
import { createAuthRouter } from "auth-kit-js/express";

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: "your-secret",
    resave: false,
    saveUninitialized: false,
  }),
);

// Auth router
const authRouter = createAuthRouter({
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
    console.log("User:", profile);
    return { token: "jwt-token" };
  },
});

app.use("/auth", authRouter);
app.listen(3000);
```

## Environment Variables

```env
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
FACEBOOK_APP_ID=xxx
FACEBOOK_APP_SECRET=xxx
TELEGRAM_BOT_TOKEN=xxx
```

## Run

```bash
npm run dev
```
