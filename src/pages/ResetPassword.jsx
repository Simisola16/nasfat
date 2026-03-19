import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import {API} from '../api';
import { useNotification } from '../context/NotificationContext';

export default function ResetPassword() {
  const { resettoken } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      await API.post(`/api/auth/reset-password/${resettoken}`, { password: formData.password });
      showNotification('Password reset successful! You can now log in.', 'success');
      navigate('/client/login');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Reset failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card" style={{ maxWidth: '440px' }}>
        <div className="card-header">
          <ShieldCheck size={48} color="var(--primary)" style={{ margin: '0 auto 1rem', display: 'block' }} />
          <h1 className="card-title">Reset Password</h1>
          <p style={{ color: 'var(--text-muted)' }}>Enter your new secure password</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <Lock className="input-icon" style={{ top: '2.5rem' }} />
            <input 
              type="password" 
              className="form-input" 
              placeholder="Min 6 characters" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Confirm New Password</label>
            <Lock className="input-icon" style={{ top: '2.5rem' }} />
            <input 
              type="password" 
              className="form-input" 
              placeholder="Confirm password" 
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Resetting...' : <>Update Password <ArrowRight size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
