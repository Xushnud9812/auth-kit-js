# React Frontend Example

OAuth integration with React.

## Login Component

```tsx
import { startOAuth } from "auth-kit-js/frontend";

export function LoginPage() {
  const handleGoogle = () => {
    startOAuth({
      provider: "google",
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirectUri: "http://localhost:3000/auth/google/callback",
      usePKCE: true,
    });
  };

  const handleFacebook = () => {
    startOAuth({
      provider: "facebook",
      clientId: import.meta.env.VITE_FACEBOOK_APP_ID,
      redirectUri: "http://localhost:3000/auth/facebook/callback",
    });
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleGoogle}>Sign in with Google</button>
      <button onClick={handleFacebook}>Sign in with Facebook</button>
    </div>
  );
}
```

## Callback Handler

```tsx
import { useEffect } from "react";
import { validateState } from "auth-kit-js/frontend";

export function CallbackPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const state = params.get("state");

    if (state && validateState(state)) {
      // State is valid, server will exchange the code
      console.log("OAuth callback successful");
    }
  }, []);

  return <div>Processing...</div>;
}
```

## Auth Context

```tsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("token", authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```
