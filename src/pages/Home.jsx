import { Link } from 'react-router-dom';
import { Shield, UserPlus, LogIn, LineChart } from 'lucide-react';

export default function Home() {
  return (
    <div className="landing-container">
      <div className="glass-card" style={{ maxWidth: '600px', animationDelay: '0.1s' }}>
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '1.5rem', borderRadius: '50%', display: 'inline-flex' }}>
              <LineChart size={48} color="white" />
            </div>
          </div>
          <h1 className="card-title" style={{ fontSize: '2.5rem' }}>Savings Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Securely manage your deposits, track progress, and build your future.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
          <div style={{ padding: '1.5rem', border: '1px solid var(--glass-border)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserPlus className="text-primary" /> For Clients
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Link to="/client/login" className="btn btn-primary">
                <LogIn size={18} /> Login
              </Link>
              <Link to="/client/register" className="btn btn-outline">
                <UserPlus size={18} /> Register
              </Link>
            </div>
          </div>
          
          {/* Removed admin block per request */}
        </div>
      </div>
    </div>
  );
}
