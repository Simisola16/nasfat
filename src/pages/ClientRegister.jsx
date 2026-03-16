import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Image as ImageIcon, Calendar, ArrowRight } from 'lucide-react';
import API from '../api';

export default function ClientRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    paymentFrequency: 'monthly',
    image: null
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('paymentFrequency', formData.paymentFrequency);
      if (formData.image) {
        data.append('image', formData.image);
      }

      await API.post('/api/auth/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/client/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card" style={{ maxWidth: '540px' }}>
        <div className="card-header">
          <h1 className="card-title">Create Account</h1>
          <p style={{ color: 'var(--text-muted)' }}>Start your savings journey today</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
          
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <User className="input-icon" />
            <input 
              type="text" 
              name="fullName" 
              className="form-input" 
              placeholder="Enter your full name" 
              value={formData.fullName}
              onChange={handleChange}
              required 
            />
          </div>

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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Password</label>
              <Lock className="input-icon" />
              <input 
                type="password" 
                name="password" 
                className="form-input" 
                placeholder="Password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <Lock className="input-icon" />
              <input 
                type="password" 
                name="confirmPassword" 
                className="form-input" 
                placeholder="Confirm" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Upload Profile Image</label>
            <div className="upload-area" onClick={() => document.getElementById('image-upload').click()} style={{ padding: '1rem' }}>
              <ImageIcon size={24} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {formData.image ? formData.image.name : 'Click to select an image'}
              </p>
              <input 
                id="image-upload" 
                type="file" 
                accept="image/*" 
                className="file-input" 
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Select Payment Frequency</label>
            <Calendar className="input-icon" />
            <select 
              name="paymentFrequency" 
              className="form-select" 
              value={formData.paymentFrequency}
              onChange={handleChange}
            >
              <option value="weekly">Weekly Savings</option>
              <option value="monthly">Monthly Savings</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : <><ArrowRight size={18} /> Create Account</>}
          </button>
        </form>

        <div className="auth-links">
          <span>Already have an account? <Link to="/client/login">Sign in</Link></span>
          <span><Link to="/" style={{ color: 'var(--text-muted)' }}>Back to Home</Link></span>
        </div>
      </div>
    </div>
  );
}
