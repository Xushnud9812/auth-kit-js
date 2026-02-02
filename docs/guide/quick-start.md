# Quick Start

Build a complete authentication flow in 5 minutes.

## 1. Setup Express Server

```typescript
// server.ts
import express from "express";
import session from "express-session";
import { createAuthRouter } from "auth-kit-js/express";

const app = express();

// Required middleware
app.use(express.json());
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  }),
);

// Create auth router
const authRouter = createAuthRouter({
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: "http://localhost:3000/auth/google/callback",
  },
  async onLogin(profile) {
    // Handle authenticated user
    console.log("User:", profile);

    // Return a token (JWT, session ID, etc.)
    return { token: "your-auth-token" };
  },
});

app.use("/auth", authRouter);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

## 2. Create Login Page

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Login</title>
  </head>
  <body>
    <h1>Login</h1>
    <button id="google-btn">Sign in with Google</button>

    <script type="module">
      import { startOAuth } from "auth-kit-js/frontend";

      document.getElementById("google-btn").onclick = () => {
        startOAuth({
          provider: "google",
          clientId: "your-client-id",
          redirectUri: "http://localhost:3000/auth/google/callback",
          usePKCE: true,
        });
      };
    </script>
  </body>
</html>
```

## 3. Handle Callback Response

The `/auth/google/callback` route returns JSON:

```json
{
  "success": true,
  "token": "your-auth-token",
  "profile": {
    "provider": "google",
    "providerUserId": "123456789",
    "email": "user@gmail.com",
    "name": "John Doe",
    "avatarUrl": "https://..."
  }
}
```

## 4. Use the Token

```typescript
// Store the token
localStorage.setItem("auth_token", response.token);

// Use for API requests
fetch("/api/me", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
  },
});
```

## Next Steps

- Add [Facebook](/providers/facebook) authentication
- Add [Telegram](/providers/telegram) authentication
- Review [Security](/guide/security) best practices
