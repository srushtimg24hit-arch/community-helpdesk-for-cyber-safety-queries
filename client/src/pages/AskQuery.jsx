import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AskQuery() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'phishing', label: 'Phishing' },
    { value: 'malware', label: 'Malware' },
    { value: 'privacy', label: 'Privacy' },
    { value: 'account', label: 'Account / Login' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title: title.trim(), description: description.trim(), category })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || 'Failed to submit query.');
        setLoading(false);
        return;
      }

      setSuccess('Your question has been posted.');
      // Optionally navigate to the new query or queries list
      // If the API returns created query id: data._id or data.id
      const newId = data && (data._id || data.id);
      setTimeout(() => {
        if (newId) navigate(`/queries/${newId}`);
        else navigate('/queries');
      }, 900);
    } catch (err) {
      console.error('Submit query error', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ask-query-root">
      <div className="container">
        <div className="card">
          <h2>Ask a Question</h2>
          <p className="muted">Describe your issue and include any relevant details so volunteers can help quickly.</p>

          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}

          <form onSubmit={handleSubmit} className="ask-form">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short, descriptive title"
              required
            />

            <label htmlFor="category">Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details: what happened, timestamps, screenshots (don't include sensitive data), and steps already taken."
              required
            />

            <div className="form-actions">
              <button className="btn primary" type="submit" disabled={loading}>{loading ? 'Posting…' : 'Post Question'}</button>
              <button
                type="button"
                className="btn ghost"
                onClick={() => navigate('/queries')}
                disabled={loading}
              >
                Cancel
              </button>
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

        .ask-form { display:flex; flex-direction:column; gap:10px }
        label { font-weight:600 }
        input[type="text"], select, textarea { width:100%; padding:10px 12px; border:1px solid #e6eef8; border-radius:8px; font-size:1rem }
        input:focus, textarea:focus, select:focus { outline:none; box-shadow:0 0 0 4px rgba(37,99,235,0.08); border-color:#2563eb }

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
