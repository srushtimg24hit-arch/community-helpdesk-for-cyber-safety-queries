import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AskQuery from './pages/AskQuery';
import ReportIncident from './pages/ReportIncident';
import AdminDashboard from './pages/AdminDashboard';

// Simple placeholder pages for About and Resources (replace with real pages if/when available)
function About() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1>About</h1>
      <p>This is the Community Helpdesk — a place to ask questions and report incidents to help people stay safe online.</p>
    </div>
  );
}

function Resources() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1>Resources</h1>
      <p>Curated links and guides about phishing, malware, privacy and account safety.</p>
    </div>
  );
}

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && (!user.role || user.role !== 'admin')) return <Navigate to="/" replace />;

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-root">
          <Navbar />

          <main className="content" style={{ padding: 20, minHeight: '70vh' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/resources" element={<Resources />} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/ask-query"
                element={
                  <ProtectedRoute>
                    <AskQuery />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/report-incident"
                element={
                  <ProtectedRoute>
                    <ReportIncident />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
