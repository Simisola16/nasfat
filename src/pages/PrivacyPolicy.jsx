import { Shield, Lock, FileText, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="dashboard-container" style={{ maxWidth: '800px', padding: '2rem 1rem' }}>
      <header className="header" style={{ marginBottom: '2rem' }}>
        <Link to="/" className="nav-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <ChevronLeft size={20} /> Back
        </Link>
        <h1 className="header-title" style={{ fontSize: '1.5rem' }}>Privacy Policy</h1>
      </header>

      <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', padding: '1rem', background: 'rgba(12, 165, 167, 0.1)', borderRadius: '12px', border: '1px solid rgba(12, 165, 167, 0.2)' }}>
          <Shield color="var(--primary)" size={32} />
          <div>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Your Privacy Matters</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Last Updated: March 16, 2026</p>
          </div>
        </div>

        <section style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} /> 1. Information We Collect
          </h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
            To provide our services, we collect information you provide directly to us, including your full name, email address, profile image, and records of your savings and payment receipts.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={20} /> 2. How We Use Your Information
          </h3>
          <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '0.95rem', paddingLeft: '1.2rem' }}>
            <li>To verify your identity and manage your savings account.</li>
            <li>To process and verify your payment receipts.</li>
            <li>To send you transactional notifications and push alerts.</li>
            <li>To provide member support and improve our platform.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>3. Data Security</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
            We implement high-standard security measures to protect your personal data. All sensitive information (like passwords) is encrypted, and your transaction receipts are stored securely on our verified cloud infrastructure.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>4. Third-Party Services</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
            We do not sell your personal data. We may use third-party providers for push notifications, cloud storage, and email delivery, all of which are compliant with global privacy standards.
          </p>
        </section>

        <section>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>5. Contact Us</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
            If you have any questions about this Privacy Policy, please contact the NASFAT Grays Thurrock Cooperative administration.
          </p>
        </section>
      </div>
      
      <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        &copy; 2026 NASFAT Savings Platform. All rights reserved.
      </p>
    </div>
  );
}
