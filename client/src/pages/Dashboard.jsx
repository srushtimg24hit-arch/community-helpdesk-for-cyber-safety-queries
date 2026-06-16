import React, { useEffect, useState } from 'react';

/**
 * Dashboard page
 * Shows summary cards: Total Queries, Reported Incidents, Recent Activities, User Profile Summary
 * Fetches data from backend endpoints and displays a responsive dashboard.
 */
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [totals, setTotals] = useState({ queries: 0, incidents: 0 });
  const [recentActivities, setRecentActivities] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        // Run requests in parallel. Endpoints are best-effort — the UI handles missing endpoints gracefully.
        const [queriesRes, incidentsRes, profileRes, activitiesRes] = await Promise.all([
          fetch('/api/queries', { credentials: 'include' }),
          fetch('/api/incidents', { credentials: 'include' }),
          fetch('/api/auth/me', { credentials: 'include' }),
          fetch('/api/activities?limit=10', { credentials: 'include' })
        ]);

        // Parse JSON safely, falling back when endpoint is not available or returns non-json
        const safeJson = async (res) => {
          if (!res || !res.ok) return null;
          try {
            return await res.json();
          } catch (e) {
            return null;
          }
        };

        const [queriesData, incidentsData, profileData, activitiesData] = await Promise.all([
          safeJson(queriesRes),
          safeJson(incidentsRes),
          safeJson(profileRes),
          safeJson(activitiesRes)
        ]);

        if (!mounted) return;

        setTotals({
          queries: Array.isArray(queriesData) ? queriesData.length : (queriesData && queriesData.total) || 0,
          incidents: Array.isArray(incidentsData) ? incidentsData.length : (incidentsData && incidentsData.total) || 0
        });

        // Recent activities: try a few shapes depending on backend
        if (activitiesData && Array.isArray(activitiesData)) {
          setRecentActivities(activitiesData.slice(0, 10));
        } else if (queriesData && Array.isArray(queriesData.data)) {
          // If queries endpoint returns { data: [...] }
          setRecentActivities((queriesData.data || []).slice(0, 10).map((q) => ({
            type: 'query',
            text: q.title || q.question || q.summary || 'Query',
            actor: (q.user && q.user.name) || q.reportedBy || 'User',
            date: q.createdAt || q.created_at
          })));
        } else if (incidentsData && Array.isArray(incidentsData.data)) {
          setRecentActivities((incidentsData.data || []).slice(0, 10).map((i) => ({
            type: 'incident',
            text: i.title || i.description || 'Incident',
            actor: (i.reportedBy && i.reportedBy.name) || 'User',
            date: i.createdAt || i.created_at
          })));
        } else {
          setRecentActivities([]);
        }

        if (profileData && profileData.data) {
          setProfile(profileData.data);
        } else if (profileData && profileData.user) {
          setProfile(profileData.user);
        } else if (profileData && profileData.name) {
          setProfile(profileData);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error('Dashboard load error', err);
        if (!mounted) return;
        setError('Unable to load dashboard data.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="dashboard-root">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="muted">Overview of recent activity and your profile summary</p>
      </div>

      {loading ? (
        <div className="grid">
          <div className="card skeleton" />
          <div className="card skeleton" />
          <div className="card skeleton big" />
          <div className="card skeleton" />
        </div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="grid">
          <section className="card stat">
            <h3>Total Queries</h3>
            <div className="stat-value">{totals.queries}</div>
            <div className="stat-sub muted">Questions posted by the community</div>
          </section>

          <section className="card stat">
            <h3>Reported Incidents</h3>
            <div className="stat-value">{totals.incidents}</div>
            <div className="stat-sub muted">Incidents reported and tracked</div>
          </section>

          <section className="card activities">
            <div className="activities-header">
              <h3>Recent Activities</h3>
              <div className="muted">Latest posts & reports</div>
            </div>

            {recentActivities.length === 0 ? (
              <div className="muted">No recent activity available.</div>
            ) : (
              <ul className="activity-list">
                {recentActivities.map((a, idx) => (
                  <li key={idx} className="activity-item">
                    <div className="activity-line">
                      <div className="activity-title">{a.text}</div>
                      <div className="activity-meta muted">{a.actor || 'User'} • {a.date ? new Date(a.date).toLocaleString() : ''}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <aside className="card profile">
            <h3>Your Profile</h3>
            {profile ? (
              <div className="profile-inner">
                <div className="avatar">{profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}</div>
                <div>
                  <div className="profile-name">{profile.name || profile.email || 'User'}</div>
                  <div className="muted">{profile.email}</div>
                  <div className="profile-role muted">{profile.role ? profile.role.toUpperCase() : ''}</div>
                </div>
              </div>
            ) : (
              <div className="muted">Not signed in or profile not available.</div>
            )}
          </aside>
        </div>
      )}

      <style>{`
        .dashboard-root { font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial; padding: 24px; max-width: 1100px; margin: 0 auto }
        .dashboard-header h1 { margin: 0 0 4px }
        .muted { color: #64748b }

        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 18px }
        .card { background: #fff; border-radius: 10px; padding: 16px; box-shadow: 0 8px 24px rgba(2,6,23,0.06) }

        .stat { display: flex; flex-direction: column; gap: 10px; align-items: flex-start }
        .stat-value { font-size: 1.9rem; font-weight: 700 }
        .stat-sub { font-size: 0.95rem }

        .activities { grid-column: span 2 }
        .activities-header { display:flex; justify-content:space-between; align-items:center }
        .activity-list { list-style:none; padding:0; margin:12px 0 0; display:flex; flex-direction:column; gap:10px }
        .activity-item { padding:10px; border-radius:8px; background:#fbfdff; display:flex; align-items:center }
        .activity-title { font-weight:600 }
        .activity-meta { font-size:0.85rem }

        .profile { display:flex; flex-direction:column; gap:12px }
        .profile-inner { display:flex; gap:12px; align-items:center }
        .avatar { width:54px; height:54px; border-radius:12px; background:linear-gradient(135deg,#06b6d4,#6366f1); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1.25rem }
        .profile-name { font-weight:700 }
        .profile-role { margin-top:6px }

        .error { color:#991b1b; background:#fff5f5; padding:12px; border-radius:8px }

        /* Skeletons */
        .skeleton { min-height: 80px; background: linear-gradient(90deg,#f1f5f9,#eef2ff,#f1f5f9); animation: shimmer 1.2s infinite; }
        .skeleton.big { min-height: 200px }
        @keyframes shimmer { 0%{background-position:-200px 0} 100%{background-position:200px 0} }

        /* Responsive */
        @media (max-width: 992px) {
          .grid { grid-template-columns: repeat(2, 1fr) }
          .activities { grid-column: span 2 }
        }

        @media (max-width: 640px) {
          .grid { grid-template-columns: 1fr }
          .activities { grid-column: auto }
        }
      `}</style>
    </div>
  );
}
