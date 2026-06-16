import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !confirm) {
      setError('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const result = await auth.register(name, email, password);
      if (!result.ok) {
        setError(result.message || 'Registration failed.');
        setLoading(false);
        return;
      }

      navigate('/');
    } catch (err) {
      console.error('Register error', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-root">
      <div className="register-card" role="main" aria-labelledby="register-heading">
        <h2 id="register-heading">Create an account</h2>
        <p className="lead">Sign up to ask questions, report incidents, and collaborate with the community.</p>

        {error && <div className="alert" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form" noValidate>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required autoComplete="name" />

          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />

          <label htmlFor="password">Password</label>
          <div className="pw-row">
            <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required autoComplete="new-password" />
            <button type="button" className="pw-toggle" aria-pressed={showPassword} aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((s) => !s)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>

          <label htmlFor="confirm">Confirm Password</label>
          <input id="confirm" type={showPassword ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat your password" required autoComplete="new-password" />

          <button className="btn submit" type="submit" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</button>
        </form>

        <div className="login-link"> <span>Already have an account?</span> <a href="/login">Sign in</a> </div>
      </div>

      <style>{`
        .register-root { min-height: 100vh; display:flex; align-items:center; justify-content:center; padding:32px; background: linear-gradient(180deg, #f8fafc, #eef2ff); }
        .register-card { width:100%; max-width:480px; background:#fff; border-radius:12px; padding:28px; box-shadow:0 10px 30px rgba(2,6,23,0.08); font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial }
        .register-card h2 { margin:0 0 6px; font-size:1.4rem }
        .lead { margin:0 0 14px; color:#475569 }
        .alert { background:#fee2e2; color:#991b1b; padding:10px 12px; border-radius:8px; margin-bottom:12px }

        .register-form { display:flex; flex-direction:column; gap:10px }
        label { font-size:0.9rem; color:#0f172a }
        input[type="text"], input[type="email"], input[type="password"] { width:100%; padding:10px 12px; border:1px solid #e6eef8; border-radius:8px; font-size:1rem; }
        input:focus { box-shadow:0 0 0 4px rgba(37,99,235,0.08); border-color:#2563eb; outline:none }

        .pw-row { display:flex; gap:8px; align-items:center }
        .pw-toggle { background:transparent; border:none; color:#2563eb; font-weight:600; cursor:pointer; padding:6px 8px; border-radius:8px }

        .btn.submit { margin-top:6px; background:#2563eb; color:#fff; border:none; padding:11px 14px; border-radius:8px; font-weight:700; cursor:pointer }
        .btn.submit[disabled] { opacity:0.8; cursor:not-allowed }

        .login-link { margin-top:14px; font-size:0.95rem; color:#475569 }
        .login-link a { margin-left:6px; color:#2563eb; text-decoration:none }

        @media (max-width:640px) { .register-card { padding:20px } }
      `}</style>
    </div>
  );
}
