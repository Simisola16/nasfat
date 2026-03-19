import { Link } from 'react-router-dom';
import { UserPlus, LogIn } from 'lucide-react';
import nasfatLogo from '../assets/nasfat-logo.png';

export default function Home() {
  return (
    <div className="landing-container">
      <div className="glass-card" style={{ maxWidth: '600px', animationDelay: '0.1s' }}>
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <img
              src={nasfatLogo}
              alt="NASFAT Logo"
              style={{ height: '120px', width: 'auto', objectFit: 'contain' }}
            />
          </div>
          <h1 className="card-title" style={{ fontSize: '2rem' }}>Cooperative Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Securely manage your deposits, track progress, and build your future.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
          <div style={{ padding: '1.5rem', border: '1px solid var(--glass-border)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserPlus className="text-primary" /> For Member
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Link to="/client/login" className="btn btn-primary">
                <LogIn size={18} /> Login
              </Link>
              <Link to="/client/register" className="btn btn-outline">
                <UserPlus size={18} /> Create Account
              </Link>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/privacy" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
