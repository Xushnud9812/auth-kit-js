# Express Adapter API

High-level Express.js integration.

## createAuthRouter

Creates an Express router with all authentication routes.

```typescript
import { createAuthRouter } from "auth-kit-js/express";

const router = createAuthRouter(config);
```

### Config

```typescript
interface AuthRouterConfig {
  google?: GoogleOAuthConfig;
  facebook?: FacebookOAuthConfig;
  telegram?: TelegramConfig;

  onLogin: (
    profile: NormalizedProfile,
    req: Request,
  ) => Promise<{ token: string }>;
  onError?: (error: Error, req: Request, res: Response) => void;

  successRedirect?: string;
  errorRedirect?: string;
  usePKCE?: boolean; // default: true

  cookieOptions?: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
    maxAge?: number;
  };
}
```

### Routes Created

| Method | Route                | Description              |
| ------ | -------------------- | ------------------------ |
| GET    | `/google`            | Start Google OAuth       |
| GET    | `/google/callback`   | Handle Google callback   |
| GET    | `/facebook`          | Start Facebook OAuth     |
| GET    | `/facebook/callback` | Handle Facebook callback |
| POST   | `/telegram/webapp`   | Verify Telegram WebApp   |
| POST   | `/telegram/widget`   | Verify Login Widget      |

### Response Format

**Success:**

```json
{
  "success": true,
  "token": "your-token",
  "profile": {
    "provider": "google",
    "providerUserId": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "avatarUrl": "https://..."
  }
}
```

**Error:**

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Example

```typescript
import express from "express";
import session from "express-session";
import { createAuthRouter } from "auth-kit-js/express";

const app = express();

app.use(express.json());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  }),
);

const auth = createAuthRouter({
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: "http://localhost:3000/auth/google/callback",
  },
  async onLogin(profile) {
    // Save user to database
    const user = await db.users.upsert(profile);
    return { token: jwt.sign({ userId: user.id }, "secret") };
  },
  successRedirect: "http://localhost:5173/dashboard",
});

app.use("/auth", auth);
```
