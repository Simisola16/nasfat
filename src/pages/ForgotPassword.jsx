import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ChevronLeft } from 'lucide-react';
import {API} from '../api';
import { useNotification } from '../context/NotificationContext';

export default function ForgotPassword() {
  const { showNotification } = useNotification();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post('/api/auth/forgot-password', { email });
      showNotification('Password reset link sent to your email!', 'success');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to send reset link', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card" style={{ maxWidth: '440px' }}>
        <div className="card-header">
          <h1 className="card-title">Forgot Password</h1>
          <p style={{ color: 'var(--text-muted)' }}>Enter your email to receive a reset link</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Email Address</label>
            <Mail className="input-icon" style={{ top: '2.5rem' }} />
            <input 
              type="email" 
              className="form-input" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Sending...' : <>Send Reset Link <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="auth-links">
          <span><Link to="/client/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}><ChevronLeft size={16} /> Back to Login</Link></span>
        </div>
      </div>
    </div>
  );
}
