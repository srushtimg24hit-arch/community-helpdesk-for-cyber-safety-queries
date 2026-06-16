import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AskQuery from './pages/AskQuery';
import ReportIncident from './pages/ReportIncident';
import AdminDashboard from './pages/AdminDashboard';

// Simple Auth helper (placeholder). Replace with real auth/context as needed.
function isAuthenticated() {
  // If using httpOnly cookies, this should call an auth/me endpoint instead.
  try {
    return !!localStorage.getItem('token');
  } catch (e) {
    return false;
  }
}

function App() {
  return (
    <Router>
      <div className="app-root">
        <nav className="main-nav">
          <div className="brand">
            <Link to="/">Community Helpdesk</Link>
          </div>

          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/ask-query">Ask</Link>
            <Link to="/report-incident">Report</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/admin-dashboard">Admin</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </nav>

        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" replace />}
            />

            <Route
              path="/ask-query"
              element={isAuthenticated() ? <AskQuery /> : <Navigate to="/login" replace />}
            />

            <Route
              path="/report-incident"
              element={isAuthenticated() ? <ReportIncident /> : <Navigate to="/login" replace />}
            />

            <Route
              path="/admin-dashboard"
              element={isAuthenticated() ? <AdminDashboard /> : <Navigate to="/login" replace />}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <style>{`
          .app-root { min-height: 100vh; display:flex; flex-direction:column }
          .main-nav { display:flex; justify-content:space-between; align-items:center; padding:12px 20px; background:#fff; border-bottom:1px solid #eef2ff }
          .main-nav .brand a { font-weight:800; color:#111827; text-decoration:none }
          .nav-links { display:flex; gap:12px; align-items:center }
          .nav-links a { color:#2563eb; text-decoration:none; font-weight:600 }
          .content { padding:20px; flex:1 }

          @media (max-width:640px) { .nav-links { display:flex; gap:8px; overflow:auto } }
        `}</style>
      </div>
    </Router>
  );
}

export default App;
