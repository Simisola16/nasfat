import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, PiggyBank, Upload, Plus, LogOut, FileText } from 'lucide-react';

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [savingsMode, setSavingsMode] = useState('monthly'); // 'weekly' or 'monthly'
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [savingsAmount, setSavingsAmount] = useState('');

  const handleLogout = () => {
    navigate('/client/login');
  };

  const handleUploadClick = () => {
    document.getElementById('receipt-upload').click();
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const submitReceipt = () => {
    if (receiptFile && savingsAmount) {
      alert(`Successfully added ₦${savingsAmount} to savings! Receipt "${receiptFile.name}" recorded.`);
      setShowUploadModal(false);
      setReceiptFile(null);
      setSavingsAmount('');
    } else {
      alert('Please enter an amount and select a receipt file.');
    }
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <div>
          <h1 className="header-title">Client Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, John Doe</p>
        </div>
        <div className="user-profile">
          <div className="avatar">
            <img src="https://i.pravatar.cc/150?u=user1" alt="User" />
          </div>
          <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', width: 'auto' }} onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Wallet size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Amount Saved This Month</div>
            <div className="stat-value">₦1,250.00</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(39, 159, 217, 0.1)', color: 'var(--secondary)' }}>
            <PiggyBank size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Amount Saved</div>
            <div className="stat-value" style={{ color: 'var(--secondary)' }}>₦14,500.00</div>
          </div>
        </div>
      </div>

      <div className="actions-grid">
        <button 
          className={`btn ${savingsMode === 'weekly' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSavingsMode('weekly')}
        >
          Weekly Savings
        </button>
        <button 
          className={`btn ${savingsMode === 'monthly' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSavingsMode('monthly')}
        >
          Monthly Savings
        </button>
      </div>

      <div className="glass-card" style={{ maxWidth: '100%', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Quick Actions</h2>
        
        <div className="actions-grid" style={{ marginBottom: 0 }}>
          <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
            <Plus size={18} /> Add to Savings
          </button>
          <button className="btn btn-outline">
            <FileText size={18} /> View Statements
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Upload Payment Receipt</h3>
              <button 
                className="btn btn-outline" 
                style={{ width: 'auto', padding: '0.25rem 0.5rem', border: 'none' }}
                onClick={() => setShowUploadModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                <label className="form-label">How much are you adding? (₦)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="Enter amount" 
                  value={savingsAmount}
                  style={{ paddingLeft: '1rem' }}
                  onChange={(e) => setSavingsAmount(e.target.value)}
                  required 
                />
              </div>

              <div 
                className="upload-area" 
                onClick={handleUploadClick}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <div style={{ background: 'rgba(12, 165, 167, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                    <Upload size={32} color="var(--primary)" />
                  </div>
                </div>
                <h4 style={{ marginBottom: '0.5rem' }}>Click or drag file to upload</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Supports JPG, PNG and PDF formats
                </p>
                
                {receiptFile && (
                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    <strong>Selected file:</strong> {receiptFile.name}
                  </div>
                )}
                
                <input 
                  id="receipt-upload" 
                  type="file" 
                  accept="image/jpeg,image/png,application/pdf"
                  className="file-input" 
                  onChange={handleFileChange}
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-outline" style={{ width: 'auto' }} onClick={() => setShowUploadModal(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                style={{ width: 'auto' }} 
                onClick={submitReceipt}
                disabled={!receiptFile || !savingsAmount || loading}
              >
                {loading ? 'Submitting...' : 'Submit Receipt'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
