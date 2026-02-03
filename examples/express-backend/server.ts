/**
 * Auth-Kit-JS Express Example
 * 
 * Complete authentication server with Google, Facebook, and Telegram
 * 
 * Run: npm run dev
 */

import express from 'express';
import session from 'express-session';
import { createAuthRouter } from '@xushnud_bek/auth-kit-js/express';
import type { NormalizedProfile } from '@xushnud_bek/auth-kit-js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }
}));

// Simple token generator (use JWT in production)
function generateToken(profile: NormalizedProfile): string {
    return Buffer.from(JSON.stringify({
        id: profile.providerUserId,
        provider: profile.provider,
        name: profile.name,
        exp: Date.now() + 86400000
    })).toString('base64');
}

// Create auth router with all providers
const authRouter = createAuthRouter({
    // Google OAuth
    google: process.env.GOOGLE_CLIENT_ID ? {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        redirectUri: `http://localhost:${PORT}/auth/google/callback`,
        scopes: ['openid', 'email', 'profile'],
    } : undefined,

    // Facebook OAuth
    facebook: process.env.FACEBOOK_APP_ID ? {
        clientId: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET!,
        redirectUri: `http://localhost:${PORT}/auth/facebook/callback`,
        scopes: ['email', 'public_profile'],
    } : undefined,

    // Telegram
    telegram: process.env.TELEGRAM_BOT_TOKEN ? {
        botToken: process.env.TELEGRAM_BOT_TOKEN,
        authDateTTL: 86400, // 24 hours
    } : undefined,

    // Handle successful login
    async onLogin(profile, req) {
        console.log('✅ User authenticated:');
        console.log('   Provider:', profile.provider);
        console.log('   User ID:', profile.providerUserId);
        console.log('   Name:', profile.name);
        console.log('   Email:', profile.email || 'N/A');

        // Generate token
        const token = generateToken(profile);

        // You can also save to session
        (req as any).session.user = profile;

        return { token };
    },

    // Handle errors
    onError(error, req, res) {
        console.error('❌ Auth error:', error.message);
        (res as express.Response).status(500).json({
            success: false,
            error: error.message
        });
    },

    // Enable PKCE for Google
    usePKCE: true,
});

// Mount auth routes
app.use('/auth', authRouter);

// Home page
app.get('/', (req, res) => {
    const user = (req as any).session?.user;
    const providers = {
        google: !!process.env.GOOGLE_CLIENT_ID,
        facebook: !!process.env.FACEBOOK_APP_ID,
        telegram: !!process.env.TELEGRAM_BOT_TOKEN,
    };

    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auth-Kit-JS Demo</title>
    <style>
        * { box-sizing: border-box; }
        body { 
            font-family: system-ui, -apple-system, sans-serif; 
            max-width: 600px; 
            margin: 50px auto; 
            padding: 20px;
            background: #f5f5f5;
        }
        h1 { color: #667eea; }
        .card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            margin: 16px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .btn { 
            display: block; 
            padding: 14px 24px; 
            margin: 8px 0; 
            border: none; 
            border-radius: 8px; 
            font-size: 16px; 
            cursor: pointer; 
            text-decoration: none; 
            text-align: center;
            transition: transform 0.2s;
        }
        .btn:hover { transform: translateY(-2px); }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .google { background: #fff; border: 1px solid #ddd; color: #333; }
        .facebook { background: #1877f2; color: white; }
        .telegram { background: #0088cc; color: white; }
        .status { 
            padding: 8px 12px; 
            border-radius: 6px; 
            margin: 4px 0;
            font-size: 14px;
        }
        .enabled { background: #c6f6d5; color: #22543d; }
        .disabled { background: #fed7d7; color: #9b2c2c; }
        .user-info { background: #e8f4fd; padding: 16px; border-radius: 8px; }
        code { background: #eee; padding: 2px 6px; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>🔐 Auth-Kit-JS Demo</h1>
    
    ${user ? `
    <div class="card user-info">
        <h3>👋 Welcome, ${user.name || 'User'}!</h3>
        <p>Provider: <code>${user.provider}</code></p>
        <p>Email: <code>${user.email || 'N/A'}</code></p>
        <a href="/logout" class="btn" style="background: #e53e3e; color: white;">Logout</a>
    </div>
    ` : `
    <div class="card">
        <h3>Provider Status</h3>
        <div class="status ${providers.google ? 'enabled' : 'disabled'}">
            Google: ${providers.google ? '✅ Enabled' : '❌ Set GOOGLE_CLIENT_ID'}
        </div>
        <div class="status ${providers.facebook ? 'enabled' : 'disabled'}">
            Facebook: ${providers.facebook ? '✅ Enabled' : '❌ Set FACEBOOK_APP_ID'}
        </div>
        <div class="status ${providers.telegram ? 'enabled' : 'disabled'}">
            Telegram: ${providers.telegram ? '✅ Enabled' : '❌ Set TELEGRAM_BOT_TOKEN'}
        </div>
    </div>
    
    <div class="card">
        <h3>Login</h3>
        <a href="/auth/google" class="btn google" ${!providers.google ? 'disabled' : ''}>
            Sign in with Google
        </a>
        <a href="/auth/facebook" class="btn facebook" ${!providers.facebook ? 'disabled' : ''}>
            Sign in with Facebook
        </a>
    </div>
    `}
    
    <div class="card">
        <h3>API Endpoints</h3>
        <pre style="background: #f5f5f5; padding: 12px; border-radius: 6px; overflow-x: auto;">
GET  /auth/google           → Start Google OAuth
GET  /auth/google/callback  → Google callback
GET  /auth/facebook         → Start Facebook OAuth
GET  /auth/facebook/callback→ Facebook callback
POST /auth/telegram/webapp  → Verify Telegram WebApp
POST /auth/telegram/widget  → Verify Login Widget</pre>
    </div>
</body>
</html>
    `);
});

// Logout
app.get('/logout', (req, res) => {
    (req as any).session.destroy(() => {
        res.redirect('/');
    });
});

// Start server
app.listen(PORT, () => {
    console.log('');
    console.log('🚀 Auth-Kit-JS Demo Server');
    console.log(`   http://localhost:${PORT}`);
    console.log('');
    console.log('📝 Providers:');
    console.log(`   Google:   ${process.env.GOOGLE_CLIENT_ID ? '✅' : '❌ Set GOOGLE_CLIENT_ID'}`);
    console.log(`   Facebook: ${process.env.FACEBOOK_APP_ID ? '✅' : '❌ Set FACEBOOK_APP_ID'}`);
    console.log(`   Telegram: ${process.env.TELEGRAM_BOT_TOKEN ? '✅' : '❌ Set TELEGRAM_BOT_TOKEN'}`);
    console.log('');
});
