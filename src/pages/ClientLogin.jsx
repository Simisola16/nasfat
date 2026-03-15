import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function ClientLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      navigate('/client/dashboard');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card">
        <div className="card-header">
          <h1 className="card-title">Member Login</h1>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to your savings dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <Mail className="input-icon" />
            <input 
              type="email" 
              name="email" 
              className="form-input" 
              placeholder="Enter your email" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <label className="form-label">Password</label>
            <Lock className="input-icon" />
            <input 
              type="password" 
              name="password" 
              className="form-input" 
              placeholder="Enter your password" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
            <a href="#" className="form-label" style={{ color: 'var(--primary)', cursor: 'pointer', marginBottom: 0 }}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing In...' : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="auth-links">
          <span>Don't have an account? <Link to="/client/register">Create Account</Link></span>
          <span><Link to="/" style={{ color: 'var(--text-muted)' }}>Back to Home</Link></span>
        </div>
      </div>
    </div>
  );
}
