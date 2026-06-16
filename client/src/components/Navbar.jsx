import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth() || {};
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  const handleLogout = async () => {
    if (logout) await logout();
    try { localStorage.removeItem('token'); } catch (e) {}
    navigate('/login');
  };

  return (
    <header className="site-nav">
      <div className="nav-inner">
        <div className="brand">
          <Link to="/">Community Helpdesk</Link>
        </div>

        <button
          className="hamburger"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Primary">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setOpen(false)}>About</Link>
          <Link to="/resources" onClick={() => setOpen(false)}>Resources</Link>
          <Link to="/ask-query" onClick={() => setOpen(false)}>Ask Query</Link>
          <Link to="/report-incident" onClick={() => setOpen(false)}>Report Incident</Link>
        </nav>

        <div className="nav-actions">
          {!loading && user ? (
            <div className="user" ref={menuRef}>
              <button className="user-btn" onClick={() => setMenuOpen((s) => !s)} aria-expanded={menuOpen}>
                {user.name ? user.name.split(' ')[0] : (user.email || 'User')}
              </button>

              {menuOpen && (
                <div className="user-menu">
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <Link to="/resources" onClick={() => setMenuOpen(false)}>Resources</Link>
                  <button className="logout" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn ghost">Log in</Link>
              <Link to="/register" className="btn primary">Register</Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .site-nav { position: sticky; top: 0; z-index: 60; background: linear-gradient(180deg,#ffffff,#fbfdff); border-bottom: 1px solid rgba(14,42,86,0.04); }
        .nav-inner { max-width: 1200px; margin: 0 auto; padding: 10px 20px; display: flex; align-items: center; gap: 12px; }

        .brand a { font-weight: 800; color: #0f172a; text-decoration: none; font-size: 1.05rem; letter-spacing: -0.2px; }

        /* Hamburger */
        .hamburger { display: none; width: 44px; height: 36px; background: transparent; border: none; cursor: pointer; padding: 6px; align-items: center; justify-content: center }
        .hamburger span { display: block; height: 2px; background: #0f172a; margin: 6px 0; border-radius: 2px; transition: all 0.18s ease }

        .nav-links { display: flex; gap: 14px; margin-left: 18px; align-items: center; }
        .nav-links a { color: #0f172a; text-decoration: none; padding: 8px 10px; border-radius: 8px; font-weight: 600 }
        .nav-links a:hover { background: rgba(37,99,235,0.06); color: #064e3b }

        .nav-actions { margin-left: auto; display: flex; align-items: center; gap: 10px }
        .auth-links { display:flex; gap:8px; align-items:center }
        .btn { padding: 8px 12px; border-radius: 10px; font-weight: 700; text-decoration: none }
        .btn.primary { background: linear-gradient(90deg,#4f46e5,#06b6d4); color: white; box-shadow: 0 6px 18px rgba(79,70,229,0.12); }
        .btn.ghost { background: transparent; border: 1px solid rgba(14,42,86,0.06); color: #2563eb }

        .user { position: relative }
        .user-btn { background: linear-gradient(135deg,#06b6d4,#6366f1); color: #fff; border: none; padding: 8px 12px; border-radius: 10px; font-weight:700; cursor: pointer }
        .user-menu { position: absolute; right: 0; top: calc(100% + 8px); background: #fff; border: 1px solid rgba(14,42,86,0.06); padding: 8px; border-radius: 10px; box-shadow: 0 12px 32px rgba(2,6,23,0.08); display:flex; flex-direction:column; gap:6px; min-width:160px }
        .user-menu a, .user-menu button { text-align:left; padding: 8px 10px; background: transparent; border: none; cursor: pointer; color: #0f172a; font-weight:600; border-radius:6px }
        .user-menu a:hover, .user-menu button:hover { background: rgba(2,6,23,0.02) }
        .user-menu .logout { color:#ef4444; font-weight:800 }

        /* Responsive */
        @media (max-width: 860px) {
          .nav-links { display: none }
          .hamburger { display: flex }
        }

        @media (max-width: 860px) {
          .nav-links.open { display: flex; position: absolute; left: 12px; right: 12px; top: 64px; background: white; flex-direction: column; gap: 8px; padding: 12px; border-radius: 12px; box-shadow: 0 12px 36px rgba(2,6,23,0.08) }
          .nav-inner { padding: 12px 16px }
          .nav-actions { display: none }
        }

        @media (max-width: 480px) {
          .brand a { font-size: 1rem }
          .btn.primary { padding: 7px 10px }
          .btn.ghost { padding: 7px 10px }
        }
      `}</style>
    </header>
  );
}
