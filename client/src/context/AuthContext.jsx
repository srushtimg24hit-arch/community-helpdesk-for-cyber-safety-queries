import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load current user from backend
  const loadUser = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (!res.ok) {
        setUser(null);
        setLoading(false);
        return;
      }
      const data = await res.json().catch(() => null);
      setUser(data && (data.user || data.data || data) ? (data.user || data.data || data) : null);
    } catch (err) {
      console.error('Auth loadUser error', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    // attempt load once on mount
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // If backend returns token (non-httpOnly), store as fallback
      if (data.token) {
        try { localStorage.setItem('token', data.token); } catch (e) { /* ignore */ }
      }

      await loadUser();
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      if (data.token) {
        try { localStorage.setItem('token', data.token); } catch (e) {}
      }
      await loadUser();
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      // Attempt server-side logout if supported
      try {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      } catch (e) {
        // ignore
      }
    } finally {
      try { localStorage.removeItem('token'); } catch (e) {}
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, refresh: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
