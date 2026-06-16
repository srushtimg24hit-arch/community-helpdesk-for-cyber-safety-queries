import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReportIncident() {
  const navigate = useNavigate();
  const [incidentType, setIncidentType] = useState('phishing');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const types = [
    { value: 'phishing', label: 'Phishing' },
    { value: 'malware', label: 'Malware' },
    { value: 'scam', label: 'Scam / Social engineering' },
    { value: 'unauthorized_access', label: 'Unauthorized access' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!incidentType || !description.trim()) {
      setError('Please select an incident type and provide a description.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type: incidentType, description: description.trim() })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || 'Failed to report incident.');
        setLoading(false);
        return;
      }

      setSuccess('Incident reported successfully.');
      const newId = data && (data._id || data.id);
      setTimeout(() => {
        if (newId) navigate(`/incidents/${newId}`);
        else navigate('/incidents');
      }, 900);
    } catch (err) {
      console.error('Report incident error', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-incident-root">
      <div className="container">
        <div className="card">
          <h2>Report an Incident</h2>
          <p className="muted">Provide details about the incident — avoid sharing sensitive secrets or passwords.</p>

          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}

          <form onSubmit={handleSubmit} className="incident-form">
            <label htmlFor="type">Incident Type</label>
            <select id="type" value={incidentType} onChange={(e) => setIncidentType(e.target.value)}>
              {types.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened, include timestamps, message text, sender addresses, or other helpful context. Do not include passwords or full credit card numbers."
              required
            />

            <div className="form-actions">
              <button className="btn primary" type="submit" disabled={loading}>{loading ? 'Reporting…' : 'Report Incident'}</button>
              <button type="button" className="btn ghost" onClick={() => navigate('/incidents')} disabled={loading}>Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .container { max-width: 900px; margin: 24px auto; padding: 0 16px }
        .card { background:#fff; border-radius:10px; padding:20px; box-shadow: 0 8px 24px rgba(2,6,23,0.06) }
        h2 { margin:0 0 6px }
        .muted { color:#64748b; margin-bottom:12px }

        .alert { padding:10px 12px; border-radius:8px; margin-bottom:12px }
        .alert.error { background:#fee2e2; color:#991b1b }
        .alert.success { background:#ecfdf5; color:#065f46 }

        .incident-form { display:flex; flex-direction:column; gap:10px }
        label { font-weight:600 }
        select, textarea { width:100%; padding:10px 12px; border:1px solid #e6eef8; border-radius:8px; font-size:1rem }
        textarea:focus, select:focus { outline:none; box-shadow:0 0 0 4px rgba(37,99,235,0.08); border-color:#2563eb }

        .form-actions { display:flex; gap:10px; margin-top:8px }
        .btn { padding:10px 14px; border-radius:8px; cursor:pointer; border:none; font-weight:700 }
        .btn.primary { background:#2563eb; color:#fff }
        .btn.ghost { background:transparent; color:#2563eb; border:2px solid #e6eef8 }

        @media (max-width: 640px) {
          .card { padding:16px }
          .form-actions { flex-direction:column-reverse }
        }
      `}</style>
    </div>
  );
}
