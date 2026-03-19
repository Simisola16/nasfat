import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Ban, Eye, LogOut, Search, User } from 'lucide-react';
import { AdminAPI } from '../api';

import { useNotification } from '../context/NotificationContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { showNotification, requestConfirmation } = useNotification();
  
  // Modals state
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeClient, setActiveClient] = useState(null);
  const [clientStatements, setClientStatements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState([]);
  const [totalClients, setTotalClients] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const adminStr = localStorage.getItem('admin');
        if (!adminStr) {
          navigate('/admin/login');
          return;
        }
        
        const res = await AdminAPI.get('/api/admin/dashboard');
        setClients(res.data.clients || []);
        setTotalClients(res.data.totalClients || res.data.clients?.length || 0);

      } catch (err) {
        console.error("Failed to fetch admin dashboard data:", err);
      }
    };
    fetchAdminData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };


  const handleViewProfile = (client) => {
    setActiveClient(client);
    setShowProfileModal(true);
  };

  const handleViewReceipt = async (client) => {
    setActiveClient(client);
    setShowReceiptModal(true);
    setClientStatements([]);
    try {
      const res = await AdminAPI.get(`/api/admin/client/${client._id}/savings`);

      setClientStatements(res.data.savings || res.data.statements || []);
    } catch (err) {
      console.error("Failed to fetch client receipts:", err);
    }
  };

  const handleVerifyPayment = async (savingId) => {
    requestConfirmation("Are you sure you want to verify this payment?", async () => {
      setLoading(true);
      try {
        await AdminAPI.put(`/api/admin/verify-saving/${savingId}`, { status: 'paid' });
        showNotification("Payment verified successfully!", 'success');
        // Refresh data
        if (activeClient) {
          const res = await AdminAPI.get(`/api/admin/client/${activeClient._id}/savings`);
          setClientStatements(res.data.savings || res.data.statements || []);
        }
        // Also refresh main client list to update status badges
        const resAdmin = await AdminAPI.get('/api/admin/dashboard');
        setClients(resAdmin.data.clients || []);
      } catch (err) {

        console.error("Failed to verify payment:", err);
        showNotification(err.response?.data?.message || "Verification failed", 'error');
      } finally {
        setLoading(false);
      }
    });
  };

  const handleGenerateStatement = async (client) => {
    setActiveClient(client);
    setShowStatementModal(true);
    setClientStatements([]); // reset before fetch

    try {
      const res = await AdminAPI.get(`/api/admin/client/${client._id}/savings`);

      setClientStatements(res.data.savings || res.data.statements || []);
    } catch (err) {
      console.error("Failed to fetch specific client savings:", err);
    }
  };

  const handleDeactivate = async (client) => {
    requestConfirmation(`Are you sure you want to deactivate ${client.fullName}'s account?`, async () => {
      setLoading(true);
      try {
        await AdminAPI.put(`/api/admin/deactivate-client/${client._id}`);
        showNotification('Client deactivated successfully!', 'success');
        // Refresh list
        const resAdmin = await AdminAPI.get('/api/admin/dashboard');
        setClients(resAdmin.data.clients || []);
      } catch (err) {

        console.error("Failed to deactivate client:", err);
        showNotification(err.response?.data?.message || 'Deactivation failed', 'error');
      } finally {
        setLoading(false);
      }
    });
  };

  const filteredClients = clients.filter(client => 
    client.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    client.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <header className="header" style={{ borderBottomColor: 'rgba(240, 90, 40, 0.2)' }}>
        <div>
          <h1 className="header-title" style={{ color: 'var(--accent-orange)' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage clients and view transactions</p>
        </div>
        <div className="user-profile">
          <div className="avatar" style={{ background: 'var(--accent-orange)' }}>
            <Users size={20} />
          </div>
          <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', width: 'auto' }} onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card" style={{ background: 'rgba(240, 90, 40, 0.05)', borderColor: 'rgba(240, 90, 40, 0.2)' }}>
          <div className="stat-icon" style={{ background: 'rgba(240, 90, 40, 0.1)', color: 'var(--accent-orange)' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Active Clients</div>
            <div className="stat-value" style={{ color: 'var(--accent-orange)' }}>{totalClients}</div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div style={{ padding: '1.5rem 1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Client Directory</h2>
          <div className="form-group" style={{ marginBottom: 0, width: '300px' }}>
            <Search className="input-icon" style={{ top: '0.875rem' }} size={18} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by client name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '0.75rem 1rem 0.75rem 2.5rem' }}
            />
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Client Information</th>
              <th>Payment Status</th>
              <th>Actions</th>
              <th>Admin Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map(client => (
              <tr key={client._id || client.id}>
                <td>
                  <div className="client-cell">
                    <img 
                      src={client.profileImage || 'https://i.pravatar.cc/150?u=fallback'} 
                      alt={client.fullName || client.name} 
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                    <div>
                      <div style={{ fontWeight: 600 }}>{client.fullName || client.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {client._id ? client._id.substring(client._id.length - 6) : client.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`status-badge status-${client.status || 'unpaid'}`}>
                    {(client.status || 'unpaid').toUpperCase()}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-outline" 
                      style={{ padding: '0.5rem', width: 'auto' }}
                      title="View Profile"
                      onClick={() => handleViewProfile(client)}
                    >
                      <User size={16} /> View Profile
                    </button>
                    <button 
                      className="btn btn-outline" 
                      style={{ padding: '0.5rem', width: 'auto' }}
                      title="View Receipts"
                      onClick={() => handleViewReceipt(client)}
                    >
                      <Eye size={16} /> View Receipts
                    </button>
                    <button 
                      className="btn btn-outline" 
                      style={{ padding: '0.5rem', width: 'auto' }}
                      title="Generate Statement"
                      onClick={() => handleGenerateStatement(client)}
                    >
                      <FileText size={16} /> Generate Statement
                    </button>
                  </div>
                </td>
                <td>
                  <button 
                    className="btn btn-danger" 
                    style={{ padding: '0.5rem 1rem', width: 'auto', fontSize: '0.875rem' }}
                    onClick={() => handleDeactivate(client)}
                    disabled={loading}
                  >
                    <Ban size={16} style={{ marginRight: '0.5rem' }} /> {loading ? 'Wait...' : 'Deactivate Client'}
                  </button>
                </td>
              </tr>
            ))}
            {filteredClients.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No clients found matching "{searchQuery}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Profile Modal */}
      {showProfileModal && activeClient && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Client Profile</h3>
              <button 
                className="btn btn-outline" 
                style={{ width: 'auto', padding: '0.25rem 0.5rem', border: 'none' }}
                onClick={() => setShowProfileModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <img 
                  src={activeClient.profileImage || 'https://i.pravatar.cc/150?u=fallback'} 
                  alt={activeClient.fullName} 
                  style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--accent-orange)' }} 
                />
              </div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{activeClient.fullName || activeClient.name}</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{activeClient.email}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left' }}>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Account Status</p>
                  <span className={`status-badge status-${activeClient.status || 'unpaid'}`}>
                    {(activeClient.status || 'unpaid').toUpperCase()}
                  </span>
                </div>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Saving frequency</p>
                  <p style={{ fontWeight: 600, textTransform: 'capitalize' }}>{activeClient.paymentFrequency || 'Monthly'}</p>
                </div>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Member Since</p>
                  <p style={{ fontWeight: 600 }}>{new Date(activeClient.createdAt).toLocaleDateString()}</p>
                </div>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Client ID</p>
                  <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>{activeClient._id}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setShowProfileModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Receipt Modal */}
      {showReceiptModal && activeClient && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Receipts for {activeClient.fullName || activeClient.name}</h3>
              <button 
                className="btn btn-outline" 
                style={{ width: 'auto', padding: '0.25rem 0.5rem', border: 'none' }}
                onClick={() => setShowReceiptModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
                Recent uploaded receipts for client verification.
              </p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', maxHeight: '60vh', overflowY: 'auto' }}>
                {clientStatements.filter(s => s.receiptUrl).length > 0 ? (
                  clientStatements.filter(s => s.receiptUrl).map((stmt, idx) => (
                    <div key={idx} style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)', width: '250px', background: 'white' }}>
                      <div style={{ height: '180px', overflow: 'hidden', background: '#f5f5f5' }}>
                        <img 
                          src={stmt.receiptUrl} 
                          alt="Receipt" 
                          style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer' }}
                          onClick={() => window.open(stmt.receiptUrl, '_blank')}
                        />
                      </div>
                      <div style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <h4 style={{ fontSize: '0.9rem', margin: 0 }}>₦{(stmt.amount || 0).toLocaleString()}</h4>
                          <span className={`status-badge status-${stmt.status}`} style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>
                            {stmt.status?.toUpperCase()}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                          Uploaded: {new Date(stmt.createdAt || stmt.date).toLocaleDateString()}
                        </p>
                        {stmt.status !== 'paid' && stmt.status !== 'verified' && (
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '0.4rem 0.5rem', width: '100%', fontSize: '0.8rem' }}
                            onClick={() => handleVerifyPayment(stmt._id)}
                            disabled={loading}
                          >
                            {loading ? 'Processing...' : 'Verify Payment'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ width: '100%', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No receipts found for this client.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Statement Modal */}
      {showStatementModal && activeClient && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Statement for {activeClient.fullName || activeClient.name}</h3>
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
                    <strong>Client:</strong> {activeClient.fullName || activeClient.name}<br />
                    <strong>Status:</strong> {(activeClient.status || 'unpaid').toUpperCase()}<br />
                    <strong>Joined:</strong> {activeClient.createdAt ? new Date(activeClient.createdAt).toLocaleDateString() : activeClient.joined}
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
                    {clientStatements.length > 0 ? (
                      clientStatements.map((stmt, idx) => (
                        <tr key={idx}>
                          <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>{stmt.createdAt || stmt.date ? new Date(stmt.createdAt || stmt.date).toLocaleDateString() : '-'}</td>
                          <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee', textTransform: 'capitalize' }}>{stmt.type || stmt.description || 'Deposit'}</td>
                          <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee', textAlign: 'right', color: 'green' }}>+₦{(stmt.amount || 0).toLocaleString()}</td>
                          <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee', textAlign: 'right' }}>
                             <span className={`status-badge status-${stmt.status || 'pending'}`}>
                               {(stmt.status || 'pending').toUpperCase()}
                             </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                         <td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                           No statements found for this client.
                         </td>
                      </tr>
                    )}
                    <tr style={{ fontWeight: 'bold' }}>
                      <td colSpan="3" style={{ padding: '0.75rem', textAlign: 'right' }}>Total Saved:</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>₦{clientStatements.reduce((sum, s) => sum + (s.amount || 0), 0).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-outline" style={{ width: 'auto' }} onClick={() => setShowStatementModal(false)}>
                Close
              </button>
              <button className="btn btn-admin" style={{ width: 'auto' }} onClick={() => window.print()}>
                <FileText size={16} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
