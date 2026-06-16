import React, { useEffect, useState } from 'react';

/**
 * AdminDashboard.jsx
 * - View Users, Queries, Incidents
 * - Answer Queries inline
 * - Dashboard statistics (totals)
 * - Defensive about response shapes and uses credentials: 'include'
 *
 * Save as: client/src/pages/AdminDashboard.jsx
 */
export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [users, setUsers] = useState([]);
  const [queries, setQueries] = useState([]);
  const [incidents, setIncidents] = useState([]);

  const [activeAnswerId, setActiveAnswerId] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [savingAnswer, setSavingAnswer] = useState(false);

  const [filter, setFilter] = useState('open'); // example filter for queries

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    setError(null);

    try {
      const [usersRes, queriesRes, incidentsRes] = await Promise.all([
        fetch('/api/admin/users', { credentials: 'include' }),
        fetch('/api/queries?limit=100', { credentials: 'include' }),
        fetch('/api/incidents?limit=100', { credentials: 'include' })
      ]);

      const safeJson = async (res) => {
        if (!res || !res.ok) return null;
        try {
          return await res.json();
        } catch (e) {
          return null;
        }
      };

      const [usersData, queriesData, incidentsData] = await Promise.all([
        safeJson(usersRes),
        safeJson(queriesRes),
        safeJson(incidentsRes)
      ]);

      setUsers(usersData && (Array.isArray(usersData) ? usersData : usersData.data || []) || []);
      setQueries(queriesData && (Array.isArray(queriesData) ? queriesData : queriesData.data || []) || []);
      setIncidents(incidentsData && (Array.isArray(incidentsData) ? incidentsData : incidentsData.data || []) || []);
    } catch (err) {
      console.error('Admin load error', err);
      setError('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  }

  const totals = {
    users: users.length,
    queries: queries.length,
    incidents: incidents.length
  };

  async function submitAnswer(queryId) {
    if (!answerText.trim()) return;
    setSavingAnswer(true);
    setError(null);

    try {
      const res = await fetch(`/api/queries/${queryId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ answer: answerText.trim() })
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(payload.message || 'Failed to save answer.');
        setSavingAnswer(false);
        return;
      }

      // Update local queries list: append answer or mark answered
      setQueries((prev) => prev.map((q) => (q._id === queryId || q.id === queryId ? { ...q, answer: payload.data || payload.answer || { text: answerText.trim(), answeredBy: 'Admin' } } : q)));

      setActiveAnswerId(null);
      setAnswerText('');
    } catch (err) {
      console.error('Answer error', err);
      setError('Network error while saving answer.');
    } finally {
      setSavingAnswer(false);
    }
  }

  function startAnswer(queryId, existing = '') {
    setActiveAnswerId(queryId);
    setAnswerText(existing || '');
  }

  function cancelAnswer() {
    setActiveAnswerId(null);
    setAnswerText('');
  }

  return (
    <div className="admin-root">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p className="muted">Manage users, queries, incidents and answer community questions.</p>
      </header>

      {loading ? (
        <div className="cards">
          <div className="card skeleton" />
        </div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <section className="stats">
            <div className="stat card">
              <div className="stat-title">Users</div>
              <div className="stat-value">{totals.users}</div>
            </div>
            <div className="stat card">
              <div className="stat-title">Queries</div>
              <div className="stat-value">{totals.queries}</div>
            </div>
            <div className="stat card">
              <div className="stat-title">Incidents</div>
              <div className="stat-value">{totals.incidents}</div>
            </div>
          </section>

          <section className="panel-grid">
            <div className="panel card">
              <h3>Users</h3>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr><td colSpan="4" className="muted">No users found.</td></tr>
                    ) : users.map((u) => (
                      <tr key={u._id || u.id || u.email}>
                        <td>{u.name || '—'}</td>
                        <td>{u.email}</td>
                        <td>{u.role || 'user'}</td>
                        <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : (u.created_at ? new Date(u.created_at).toLocaleDateString() : '—')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="panel card">
              <h3>Queries</h3>

              <div className="controls">
                <label>
                  Filter:
                  <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="open">Open</option>
                    <option value="answered">Answered</option>
                    <option value="all">All</option>
                  </select>
                </label>
                <button className="btn" onClick={loadAll}>Refresh</button>
              </div>

              <div className="table-wrap small">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>Answer</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queries.filter((q) => {
                      if (filter === 'open') return !q.answer;
                      if (filter === 'answered') return !!q.answer;
                      return true;
                    }).map((q) => (
                      <tr key={q._id || q.id}>
                        <td>{q.title || q.question || '—'}</td>
                        <td>{(q.user && q.user.name) || (q.reportedBy && q.reportedBy.name) || q.email || 'User'}</td>
                        <td>{q.category || q.tags || 'general'}</td>
                        <td>{q.answer ? (q.answer.text || q.answer) : '—'}</td>
                        <td>
                          {!q.answer && (
                            <button className="btn small" onClick={() => startAnswer(q._id || q.id)} aria-label={`Answer ${q.title}`}>
                              Answer
                            </button>
                          )}
                          {q.answer && (
                            <button className="btn small ghost" onClick={() => startAnswer(q._id || q.id, (q.answer && (q.answer.text || q.answer)) || '')}>
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {activeAnswerId && (
                <div className="answer-box card">
                  <h4>Answer Query</h4>
                  <textarea value={answerText} onChange={(e) => setAnswerText(e.target.value)} rows={6} placeholder="Write your answer here" />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button className="btn primary" disabled={savingAnswer} onClick={() => submitAnswer(activeAnswerId)}>{savingAnswer ? 'Saving…' : 'Save Answer'}</button>
                    <button className="btn ghost" onClick={cancelAnswer}>Cancel</button>
                  </div>
                </div>
              )}
            </div>

            <div className="panel card">
              <h3>Incidents</h3>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Reporter</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidents.length === 0 ? (
                      <tr><td colSpan="4" className="muted">No incidents found.</td></tr>
                    ) : incidents.map((it) => (
                      <tr key={it._id || it.id}>
                        <td>{it.type || it.incidentType || '—'}</td>
                        <td style={{ maxWidth: 320 }}>{(it.description && (it.description.length > 120 ? it.description.slice(0, 120) + '…' : it.description)) || '—'}</td>
                        <td>{(it.reportedBy && it.reportedBy.name) || it.email || 'User'}</td>
                        <td>{it.status || 'open'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      )}

      <style>{`
        .admin-root { font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial; padding: 20px; max-width: 1200px; margin: 0 auto }
        .admin-header h1 { margin:0 0 6px }
        .muted { color:#64748b }

        .stats { display:flex; gap:12px; margin: 12px 0 18px }
        .stat { flex:1; padding:16px; border-radius:10px; background:#fff; box-shadow:0 8px 24px rgba(2,6,23,0.06); text-align:center }
        .stat-title { font-size:0.95rem; color:#475569 }
        .stat-value { font-size:1.9rem; font-weight:700 }

        .panel-grid { display:grid; grid-template-columns: 1fr 1.4fr 1fr; gap: 18px }
        .panel h3 { margin:0 0 8px }

        .table-wrap { overflow:auto }
        .table-wrap.small { max-height: 420px; overflow:auto }
        table.table { width:100%; border-collapse:collapse }
        table.table th, table.table td { text-align:left; padding:8px 10px; border-bottom: 1px solid #eef2ff }

        .controls { display:flex; gap:12px; align-items:center; margin-bottom:8px }

        .btn { background:#2563eb; color:#fff; border:none; padding:8px 10px; border-radius:8px; cursor:pointer; font-weight:700 }
        .btn.ghost { background:transparent; color:#2563eb; border:2px solid #e6eef8 }
        .btn.small { padding:6px 8px; font-weight:600 }

        .answer-box { margin-top:12px; padding:12px }
        .answer-box textarea { width:100%; padding:10px; border-radius:8px; border:1px solid #e6eef8 }

        .card { background:#fff; border-radius:10px }
        .error { color:#991b1b; background:#fff5f5; padding:12px; border-radius:8px }

        .skeleton { min-height: 100px; background: linear-gradient(90deg,#f1f5f9,#eef2ff,#f1f5f9); background-size: 400% 100%; animation: shimmer 1.2s linear infinite; }
        @keyframes shimmer { 0%{background-position:0 0} 100%{background-position:-400% 0} }

        @media (max-width: 992px) {
          .panel-grid { grid-template-columns: 1fr }
          .activities, .panel { order: 2 }
        }

        @media (max-width: 640px) {
          .stats { flex-direction:column }
        }
      `}</style>
    </div>
  );
}
