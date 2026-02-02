/**
 * Express Backend Example
 * 
 * Full example of using auth-kit-js with Express.js
 */

import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { createAuthRouter } from 'auth-kit-js/express';
import type { NormalizedProfile } from 'auth-kit-js';

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
}));

// In-memory user store (replace with your database)
const users = new Map<string, { id: string; profile: NormalizedProfile }>();

// Generate a simple token (replace with JWT in production)
function generateToken(userId: string): string {
    return Buffer.from(`${userId}:${Date.now()}`).toString('base64');
}

// Create auth router
const authRouter = createAuthRouter({
    // Google OAuth configuration
    google: process.env.GOOGLE_CLIENT_ID ? {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        redirectUri: `${process.env.BASE_URL || 'http://localhost:3000'}/auth/google/callback`,
        scopes: ['openid', 'email', 'profile'],
    } : undefined,

    // Facebook OAuth configuration
    facebook: process.env.FACEBOOK_APP_ID ? {
        clientId: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET!,
        redirectUri: `${process.env.BASE_URL || 'http://localhost:3000'}/auth/facebook/callback`,
        scopes: ['email', 'public_profile'],
    } : undefined,

    // Telegram configuration
    telegram: process.env.TELEGRAM_BOT_TOKEN ? {
        botToken: process.env.TELEGRAM_BOT_TOKEN,
        authDateTTL: 86400, // 24 hours
    } : undefined,

    // Handle successful login
    async onLogin(profile, req) {
        console.log('User authenticated:', {
            provider: profile.provider,
            id: profile.providerUserId,
            email: profile.email,
            name: profile.name,
        });

        // Create or update user
        const uniqueId = `${profile.provider}:${profile.providerUserId}`;
        let user = users.get(uniqueId);

        if (!user) {
            user = {
                id: uniqueId,
                profile,
            };
            users.set(uniqueId, user);
            console.log('New user created:', uniqueId);
        } else {
            user.profile = profile;
            console.log('User updated:', uniqueId);
        }

        // Generate token
        const token = generateToken(user.id);

        return { token };
    },

    // Optional: Custom error handler
    onError(error, req, res) {
        console.error('Auth error:', error);
        res.status(error instanceof Error && 'statusCode' in error
            ? (error as any).statusCode
            : 500
        ).json({
            success: false,
            error: error.message,
        });
    },

    // Optional: Redirect after success
    // successRedirect: 'http://localhost:5173/dashboard',
    // errorRedirect: 'http://localhost:5173/login?error=true',
});

// Mount auth router
app.use('/auth', authRouter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Get current user (example protected route)
app.get('/api/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.slice(7);
    try {
        const decoded = Buffer.from(token, 'base64').toString();
        const [userId] = decoded.split(':');
        const user = users.get(userId);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        res.json({
            id: user.id,
            email: user.profile.email,
            name: user.profile.name,
            avatarUrl: user.profile.avatarUrl,
            provider: user.profile.provider,
        });
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Auth endpoints:');
    console.log(`  - GET  /auth/google`);
    console.log(`  - GET  /auth/facebook`);
    console.log(`  - POST /auth/telegram/webapp`);
    console.log(`  - POST /auth/telegram/widget`);
});
