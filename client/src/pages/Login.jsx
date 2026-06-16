import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      // If your API returns a token, you can store it. If it sets an httpOnly cookie, no need.
      if (data.token) {
        try {
          localStorage.setItem('token', data.token);
        } catch (e) {
          // ignore storage errors
        }
      }

      // Redirect to dashboard or home
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Network error - please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Sign in</h1>
        <p className="lead">Access your account and manage incidents or questions.</p>

        {error && <div className="alert" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />

          <label htmlFor="password">Password</label>
          <div className="password-row">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="toggle"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button className="submit" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="meta">
          <a href="/register">Create an account</a>
          <a href="/forgot-password">Forgot password?</a>
        </div>
      </div>

      <style>{`
        .login-page { min-height: 100vh; display:flex; align-items:center; justify-content:center; background: linear-gradient(180deg,#f8fafc, #eef2ff); padding:32px }
        .login-card { width:100%; max-width:420px; background:#fff; border-radius:12px; padding:28px; box-shadow: 0 8px 30px rgba(2,6,23,0.08) }
        .login-card h1 { margin:0 0 6px; font-size:1.5rem }
        .lead { margin:0 0 16px; color:#64748b }
        .alert { background:#fee2e2; color:#991b1b; padding:10px 12px; border-radius:8px; margin-bottom:12px }

        .login-form { display:flex; flex-direction:column; gap:10px }
        label { font-size:0.9rem; color:#334155 }
        input[type="email"], input[type="password"], input[type="text"] { width:100%; padding:10px 12px; border:1px solid #e6eef8; border-radius:8px; outline:none; font-size:1rem }
        input:focus { box-shadow:0 0 0 4px rgba(37,99,235,0.08); border-color: #2563eb }

        .password-row { display:flex; gap:8px; align-items:center }
        .password-row .toggle { background:transparent; border:none; color:#2563eb; font-weight:600; cursor:pointer; padding:6px 8px }

        .submit { margin-top:6px; background:#2563eb; color:#fff; border:none; padding:11px 14px; border-radius:8px; font-weight:700; cursor:pointer }
        .submit[disabled] { opacity:0.7; cursor:not-allowed }

        .meta { display:flex; justify-content:space-between; margin-top:14px; font-size:0.95rem }
        .meta a { color:#2563eb; text-decoration:none }

        @media (max-width: 640px) {
          .login-card { padding:20px }
          .login-page { padding:20px }
        }
      `}</style>
    </div>
  );
}
