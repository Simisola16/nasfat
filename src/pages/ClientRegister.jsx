import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Image as ImageIcon, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import {API} from '../api';
import { useNotification } from '../context/NotificationContext';

export default function ClientRegister() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
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

    if (formData.password !== formData.confirmPassword) {
      showNotification('Passwords do not match', 'error');
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
      
      setIsVerifying(true);
      showNotification('Registration successful! Please check your email for the 6-digit OTP.', 'success');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    const otpString = otp.join('');
    
    if (otpString.length < 6) {
      showNotification('Please enter the complete 6-digit code', 'error');
      setLoading(false);
      return;
    }

    try {
      await API.post('/api/auth/verify-otp', { email: formData.email, otp: otpString });
      showNotification('Email verified successfully! You can now log in.', 'success');
      navigate('/client/login');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Verification failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await API.post('/api/auth/resend-otp', { email: formData.email });
      showNotification('A new OTP has been sent to your email.', 'success');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to resend OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card" style={{ maxWidth: '440px' }}>
        <div className="card-header">
          <h1 className="card-title">{isVerifying ? 'Verify Email' : 'Create Account'}</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {isVerifying ? `Enter the 6-digit code sent to ${formData.email}` : 'Start your savings journey today'}
          </p>
        </div>

        {isVerifying ? (
          <form onSubmit={handleVerifyOTP}>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="form-input"
                  style={{ width: '45px', padding: '0.875rem 0', textAlign: 'center', fontSize: '1.25rem' }}
                  value={data}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onFocus={(e) => e.target.select()}
                />
              ))}
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginBottom: '1.5rem' }}>
              {loading ? 'Verifying...' : <><ShieldCheck size={18} /> Verify OTP</>}
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Didn't receive the code? </span>
              <button 
                type="button" 
                onClick={handleResendOTP} 
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
                disabled={loading}
              >
                Resend OTP
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <User className="input-icon" style={{ top: '2.5rem' }} />
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
              <Mail className="input-icon" style={{ top: '2.5rem' }} />
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
                <Lock className="input-icon" style={{ top: '2.5rem' }} />
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
                <Lock className="input-icon" style={{ top: '2.5rem' }} />
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
              <Calendar className="input-icon" style={{ top: '2.5rem' }} />
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
        )}

        <div className="auth-links">
          <span>Already have an account? <Link to="/client/login">Sign in</Link></span>
          <span><Link to="/" style={{ color: 'var(--text-muted)' }}>Back to Home</Link></span>
        </div>
      </div>
    </div>
  );
}
