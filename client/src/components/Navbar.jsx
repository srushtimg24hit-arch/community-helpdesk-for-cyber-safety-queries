import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = () => {
    try {
      return !!localStorage.getItem('token');
    } catch (e) {
      return false;
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
    } catch (e) {
      // ignore
    }
    navigate('/login');
  };

  return (
    <header className="site-nav">
      <div className="nav-inner">
        <div className="brand">
          <Link to="/">Community Helpdesk</Link>
        </div>

        <button
          className="menu-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
        >
          ☰
        </button>

        <nav className={`links ${open ? 'open' : ''}`} aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/ask-query">Ask</Link>
          <Link to="/report-incident">Report</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/admin-dashboard">Admin</Link>

          {!isAuthenticated() ? (
            <>
              <Link to="/login" className="auth">Login</Link>
              <Link to="/register" className="auth">Register</Link>
            </>
          ) : (
            <button className="auth logout" onClick={handleLogout}>Logout</button>
          )}
        </nav>
      </div>

      <style>{`
        .site-nav { background:#fff; border-bottom:1px solid #eef2ff; position:sticky; top:0; z-index:40 }
        .nav-inner { max-width:1200px; margin:0 auto; padding:10px 16px; display:flex; align-items:center; justify-content:space-between; gap:12px }
        .brand a { font-weight:800; color:#111827; text-decoration:none }
        .menu-toggle { display:none; background:transparent; border:none; font-size:20px; cursor:pointer }
        .links { display:flex; gap:12px; align-items:center }
        .links a { color:#2563eb; text-decoration:none; font-weight:600 }
        .auth { padding:6px 10px; border-radius:8px }
        .logout { background:#ef4444; color:#fff; border:none; padding:6px 10px; border-radius:8px; cursor:pointer }

        @media (max-width: 720px) {
          .menu-toggle { display:block }
          .links { position:absolute; right:16px; top:56px; background:#fff; border:1px solid #eef2ff; flex-direction:column; padding:10px; border-radius:8px; display:none; min-width:180px }
          .links.open { display:flex }
        }
      `}</style>
    </header>
  );
}
