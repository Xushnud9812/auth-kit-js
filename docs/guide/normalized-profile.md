# Normalized Profile

All providers return a consistent `NormalizedProfile` object.

## Interface

```typescript
interface NormalizedProfile {
  /** Authentication provider */
  provider: "google" | "facebook" | "telegram";

  /** Unique user ID from the provider */
  providerUserId: string;

  /** User's email (not available for Telegram) */
  email?: string;

  /** User's display name */
  name?: string;

  /** Profile picture URL */
  avatarUrl?: string;

  /** Original provider response */
  raw: unknown;
}
```

## Provider Data

### Google

| Field            | Source                   |
| ---------------- | ------------------------ |
| `providerUserId` | ID token `sub` claim     |
| `email`          | ID token `email` claim   |
| `name`           | ID token `name` claim    |
| `avatarUrl`      | ID token `picture` claim |
| `raw`            | Full ID token            |

### Facebook

| Field            | Source                       |
| ---------------- | ---------------------------- |
| `providerUserId` | Graph API `id`               |
| `email`          | Graph API `email`            |
| `name`           | Graph API `name`             |
| `avatarUrl`      | Graph API `picture.data.url` |
| `raw`            | Full Graph API response      |

### Telegram

| Field            | Source                    |
| ---------------- | ------------------------- |
| `providerUserId` | initData `user.id`        |
| `email`          | Not available             |
| `name`           | `first_name + last_name`  |
| `avatarUrl`      | initData `user.photo_url` |
| `raw`            | Full initData             |

## Usage Example

```typescript
createAuthRouter({
  async onLogin(profile) {
    // Create or update user
    const user = await db.users.upsert({
      where: {
        provider: profile.provider,
        providerUserId: profile.providerUserId,
      },
      create: {
        email: profile.email,
        name: profile.name,
        avatar: profile.avatarUrl,
      },
      update: {
        name: profile.name,
        avatar: profile.avatarUrl,
      },
    });

    return { token: createToken(user.id) };
  },
});
```
