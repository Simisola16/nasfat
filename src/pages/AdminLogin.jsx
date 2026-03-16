import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Shield, ArrowRight, AlertTriangle } from 'lucide-react';

import API from '../api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await API.post('/api/auth/admin-login', formData);
      console.log(data);
      if(data.admin.role !== 'admin'){
        alert("You are not authorized to login as admin");
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('admin', JSON.stringify(data.admin));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container admin" style={{ background: 'linear-gradient(135deg, rgba(26,26,30,1) 0%, rgba(240,90,40,0.1) 100%)' }}>
      <div className="glass-card" style={{ borderTop: '4px solid var(--accent-orange)' }}>
        <div className="card-header">
          <Shield size={48} color="var(--accent-orange)" style={{ margin: '0 auto 1rem', display: 'block' }} />
          <h1 className="card-title admin-title">Admin Access</h1>
          <p style={{ color: 'var(--text-muted)' }}>Secure login required</p>
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(240,90,40,0.1)', border: '1px solid rgba(240,90,40,0.2)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--accent-orange)' }}>
            <strong>Demo Credentials:</strong><br/>
            Email: admin@nasfat.com<br/>
            Pass: admin123
          </div>
        </div>

        <form onSubmit={handleSubmit} className="admin">
          {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
          
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <Mail className="input-icon" />
            <input 
              type="email" 
              name="email" 
              className="form-input" 
              placeholder="admin@example.com" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Admin Password</label>
            <Lock className="input-icon" />
            <input 
              type="password" 
              name="password" 
              className="form-input" 
              placeholder="Enter secure password" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>

          <button type="submit" className="btn btn-admin" disabled={loading}>
            {loading ? 'Authenticating...' : <>Authenticate <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="auth-links">
          <span><Link to="/" style={{ color: 'var(--text-muted)' }}>Back to Home</Link></span>
        </div>
      </div>
    </div>
  );
}
