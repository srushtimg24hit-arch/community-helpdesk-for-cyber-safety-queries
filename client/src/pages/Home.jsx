import React from 'react';

export default function Home() {
  return (
    <div className="ch-container">
      <header className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">Community Helpdesk for Cyber Safety Queries</h1>
          <p className="hero-sub">Ask questions, report incidents, and get expert guidance to stay safe online.</p>
          <div className="hero-actions">
            <a href="/register" className="btn primary">Get Started</a>
            <a href="#features" className="btn ghost">Learn More</a>
          </div>
        </div>
      </header>

      <main>
        <section className="about" id="about">
          <div className="about-inner">
            <div className="about-text">
              <h2>About</h2>
              <p>
                This project connects members of the community with cyber safety resources and experts. You
                can post queries, report suspicious activity or incidents, and collaborate with volunteers and
                professionals to improve digital safety for everyone.
              </p>
              <p>
                We prioritise accessibility, responsible disclosure, and practical guidance so community members
                can act on advice quickly and safely.
              </p>
            </div>
            <div className="about-card">
              <h3>Who we help</h3>
              <ul>
                <li>Students and educators</li>
                <li>Small businesses and NGOs</li>
                <li>Parents and caregivers</li>
                <li>Anyone who wants to learn about cyber safety</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="features" id="features">
          <h2>Key Features</h2>
          <div className="features-grid">
            <article className="feature">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1v22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 7h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3>Ask Questions</h3>
              <p>Post cyber safety questions and get community or expert answers with clear, actionable steps.</p>
            </article>

            <article className="feature">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2l3 6h6l-5 4 2 7-6-4-6 4 2-7-5-4h6z" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3>Report Incidents</h3>
              <p>Quickly report suspicious messages, phishing attempts, or security incidents to get guidance and tracking.</p>
            </article>

            <article className="feature">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12h18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 6h10M7 18h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3>Expert Volunteers</h3>
              <p>Connect with trained volunteers and domain experts who can assist with triage and remediation advice.</p>
            </article>

            <article className="feature">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M7 21h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <h3>Resources & Guides</h3>
              <p>Browse curated guides on phishing, passwords, secure browsing, privacy settings and responsible disclosure.</p>
            </article>
          </div>
        </section>

        <section className="cta">
          <div className="cta-inner">
            <h2>Ready to make the internet safer for your community?</h2>
            <p>Sign up, ask your first question, or report an incident — we’ll help you every step of the way.</p>
            <div className="cta-actions">
              <a href="/register" className="btn primary large">Create an account</a>
              <a href="/api/incidents" className="btn ghost">View incidents</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <strong>Community Helpdesk</strong>
            <p>A project to improve cyber safety through community collaboration.</p>
          </div>
          <nav className="footer-nav">
            <a href="/about">About</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/contact">Contact</a>
          </nav>
        </div>
        <div className="copyright">© {new Date().getFullYear()} Community Helpdesk. All rights reserved.</div>
      </footer>

      <style>{`
        .ch-container { font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color: #0f172a; }
        .hero { background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%); color: #fff; padding: 72px 16px; text-align: center; }
        .hero-inner { max-width: 960px; margin: 0 auto; }
        .hero-title { font-size: 2.25rem; margin: 0 0 12px; line-height: 1.1; }
        .hero-sub { font-size: 1.0625rem; margin: 0 0 20px; opacity: 0.95; }
        .hero-actions { display:flex; gap:12px; justify-content:center; flex-wrap:wrap }
        .btn { display:inline-block; padding:10px 18px; border-radius:8px; text-decoration:none; font-weight:600 }
        .btn.primary { background:#001F3F; color:#fff }
        .btn.primary.large { padding:14px 22px; font-size:1.05rem }
        .btn.ghost { background:transparent; color:inherit; border:2px solid rgba(255,255,255,0.85); }

        main { padding: 40px 16px; max-width:1200px; margin:0 auto }
        .about-inner { display:flex; gap:24px; align-items:flex-start; flex-wrap:wrap }
        .about-text { flex:1 1 420px; min-width:260px }
        .about-card { flex:0 0 320px; border-radius:10px; padding:18px; background:#f8fafc; box-shadow:0 6px 18px rgba(2,6,23,0.06) }
        .about-card h3 { margin-top:0 }

        .features { margin-top:48px }
        .features h2 { text-align:center; margin-bottom:18px }
        .features-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px }
        .feature { background:#fff; border-radius:10px; padding:18px; box-shadow:0 6px 18px rgba(2,6,23,0.06); text-align:left }
        .feature-icon { width:48px; height:48px; color:#2563eb; margin-bottom:10px }
        .feature h3 { margin:6px 0 }

        .cta { margin-top:56px; background:linear-gradient(90deg,#06b6d4, #3b82f6); color:#fff; padding:40px 16px; border-radius:12px }
        .cta-inner { max-width:900px; margin:0 auto; text-align:center }
        .cta-actions { margin-top:16px; display:flex; gap:12px; justify-content:center; flex-wrap:wrap }
        .btn.ghost { background:rgba(255,255,255,0.12); color:#fff; border:1px solid rgba(255,255,255,0.18) }

        .site-footer { margin-top:40px; padding:24px 16px; border-top:1px solid #e6eef8; background:#fff }
        .footer-inner { max-width:1100px; margin:0 auto; display:flex; justify-content:space-between; gap:12px; align-items:center; flex-wrap:wrap }
        .footer-nav a { margin-left:12px; color:#334155; text-decoration:none }
        .copyright { text-align:center; margin-top:12px; font-size:0.9rem; color:#64748b }

        /* Responsive */
        @media (max-width: 992px) {
          .features-grid { grid-template-columns:repeat(2,1fr) }
          .hero-title { font-size:1.9rem }
        }

        @media (max-width: 640px) {
          .features-grid { grid-template-columns:1fr }
          .about-inner { flex-direction:column }
          .about-card { width:100% }
          .hero { padding:48px 12px }
          .hero-title { font-size:1.6rem }
        }
      `}</style>
    </div>
  );
}
