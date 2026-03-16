import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, PiggyBank, Upload, Plus, LogOut, FileText } from 'lucide-react';
import API from '../api';
import { useNotification } from '../context/NotificationContext';

export default function ClientDashboard() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [savingsMode, setSavingsMode] = useState('monthly'); // 'weekly' or 'monthly'
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [savingsAmount, setSavingsAmount] = useState('');
  const [user, setUser] = useState(null);
  const [statements, setStatements] = useState([]);
  
  // Calculate aggregated stats depending on the selected mode
  const filteredStatements = statements.filter(stmt => (stmt.type || 'monthly').toLowerCase() === savingsMode.toLowerCase());

  const paidStatements = filteredStatements.filter(stmt => 
    stmt.status === 'paid' || stmt.status === 'verified' || stmt.status === 'approved'
  );

  const currentTotal = paidStatements.reduce((sum, s) => sum + (s.amount || 0), 0);
  
  const currentMonthTotal = paidStatements.reduce((sum, s) => {
    const d = new Date(s.createdAt || s.date || Date.now());
    const now = new Date();
    if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
      return sum + (s.amount || 0);
    }
    return sum;
  }, 0);


  const fetchDashboardData = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser) {
        navigate('/client/login');
        return;
      }
      setUser(storedUser);

      // Fetch dashboard data
      const res = await API.get('/api/client/dashboard');
      setStatements(res.data.savings || res.data.statements || res.data.transactions || []);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      // navigate('/client/login'); // Or handle error appropriately
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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

  const submitReceipt = async () => {
    if (!receiptFile || !savingsAmount) {
      showNotification('Please enter an amount and select a receipt file.', 'info');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('amount', savingsAmount);
      data.append('type', savingsMode);
      data.append('receipt', receiptFile);

      await API.post('/api/client/savings', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showNotification(`Successfully submitted receipt for ₦${savingsAmount}!`, 'success');
      setShowUploadModal(false);
      setReceiptFile(null);
      setSavingsAmount('');
      fetchDashboardData();
    } catch (err) {
      console.log(err);
      showNotification(err.response?.data?.message || 'Failed to submit receipt.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <div>
          <h1 className="header-title">Client Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.fullName || 'Member'}</p>
        </div>
        <div className="user-profile">
          <div className="avatar">
            <img src={user?.profileImage || "https://i.pravatar.cc/150?u=user1"} alt="User" />
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
            <div className="stat-label">Amount Saved This Month ({savingsMode})</div>
            <div className="stat-value">₦{currentMonthTotal.toLocaleString()}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(39, 159, 217, 0.1)', color: 'var(--secondary)' }}>
            <PiggyBank size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Amount Saved ({savingsMode})</div>
            <div className="stat-value" style={{ color: 'var(--secondary)' }}>₦{currentTotal.toLocaleString()}</div>
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
          <button className="btn btn-outline" onClick={() => setShowStatementModal(true)}>
            <FileText size={18} /> View Statements
          </button>
        </div>
      </div>

      <div className="table-container" style={{ marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem 1.5rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Recent Savings History</h2>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStatements.length > 0 ? (
              filteredStatements.map((stmt, idx) => (
                <tr key={idx}>
                  <td>{stmt.createdAt || stmt.date ? new Date(stmt.createdAt || stmt.date).toLocaleDateString() : '-'}</td>
                  <td style={{ textTransform: 'capitalize' }}>{stmt.type || stmt.description || 'Deposit'}</td>
                  <td style={{ color: 'green', fontWeight: 'bold' }}>+₦{(stmt.amount || 0).toLocaleString()}</td>
                  <td>
                     <span className={`status-badge status-${stmt.status || 'pending'}`}>
                       {(stmt.status || 'pending').toUpperCase()}
                     </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                 <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                   No savings history found.
                 </td>
              </tr>
            )}
          </tbody>
        </table>
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
                <label className="form-label">Payment Type</label>
                <select 
                  className="form-select" 
                  value={savingsMode}
                  onChange={(e) => setSavingsMode(e.target.value)}
                >
                  <option value="weekly">Weekly Savings</option>
                  <option value="monthly">Monthly Savings</option>
                </select>
              </div>

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
      {/* View Statements Modal */}
      {showStatementModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Savings Statements</h3>
              <button 
                className="btn btn-outline" 
                style={{ width: 'auto', padding: '0.25rem 0.5rem', border: 'none' }}
                onClick={() => setShowStatementModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="statement-doc">
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #eee', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ color: '#f05a28', margin: 0 }}>SAVINGS STATEMENT</h2>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Generated: {new Date().toLocaleDateString()}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong>Client:</strong> {user?.fullName || 'Member'}<br />
                  </div>
                </div>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                  <thead>
                    <tr style={{ background: '#f9f9f9', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>Date</th>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>Type</th>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd', textAlign: 'right' }}>Amount</th>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd', textAlign: 'right' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paidStatements.length > 0 ? (
                      paidStatements.map((stmt, idx) => (
                        <tr key={idx}>
                          <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{stmt.createdAt || stmt.date ? new Date(stmt.createdAt || stmt.date).toLocaleDateString() : '-'}</td>
                          <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee', textTransform: 'capitalize' }}>{stmt.type || stmt.description || 'Deposit'}</td>
                          <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee', textAlign: 'right', color: 'green' }}>+₦{(stmt.amount || 0).toLocaleString()}</td>
                          <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee', textAlign: 'right' }}>
                             <span className={`status-badge status-${stmt.status || 'paid'}`}>
                               {(stmt.status || 'paid').toUpperCase()}
                             </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                         <td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                           No statements found for {savingsMode} savings.
                         </td>
                      </tr>
                    )}
                    <tr style={{ fontWeight: 'bold' }}>
                      <td colSpan="3" style={{ padding: '0.75rem', textAlign: 'right' }}>Total {savingsMode} Balance:</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>₦{currentTotal.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-outline" style={{ width: 'auto' }} onClick={() => setShowStatementModal(false)}>
                Close
              </button>
              <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => window.print()}>
                <FileText size={16} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
