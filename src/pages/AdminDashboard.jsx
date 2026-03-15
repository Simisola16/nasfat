import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Ban, Eye, LogOut, Search } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // Modals state
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [activeClient, setActiveClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    navigate('/admin/login');
  };

  const [clients, setClients] = useState([
    { id: 1, name: 'Alice Smith', image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', status: 'paid', joined: '2023-01-15' },
    { id: 2, name: 'Bob Johnson', image: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', status: 'unpaid', joined: '2023-03-22' },
    { id: 3, name: 'Charlie Davis', image: 'https://i.pravatar.cc/150?u=a042581f4e29026704f', status: 'paid', joined: '2023-05-10' },
    { id: 4, name: 'Diana Clark', image: 'https://i.pravatar.cc/150?u=a042581f4e29026704g', status: 'unpaid', joined: '2023-08-05' },
  ]);

  const handleViewReceipt = (client) => {
    setActiveClient(client);
    setShowReceiptModal(true);
  };

  const handleGenerateStatement = (client) => {
    setActiveClient(client);
    setShowStatementModal(true);
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            <div className="stat-value" style={{ color: 'var(--accent-orange)' }}>423</div>
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
              <tr key={client.id}>
                <td>
                  <div className="client-cell">
                    <img 
                      src={client.image} 
                      alt={client.name} 
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                    <div>
                      <div style={{ fontWeight: 600 }}>{client.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {client.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`status-badge status-${client.status}`}>
                    {client.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                  <button className="btn btn-danger" style={{ padding: '0.5rem 1rem', width: 'auto', fontSize: '0.875rem' }}>
                    <Ban size={16} style={{ marginRight: '0.5rem' }} /> Deactivate Client
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

      {/* View Receipt Modal */}
      {showReceiptModal && activeClient && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Receipts for {activeClient.name}</h3>
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
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)', width: '250px' }}>
                  <div style={{ background: '#ddd', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                    [Receipt Image Placeholder]
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Oct 2023 Payment</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Uploaded: Oct 15, 2023</p>
                    <button className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', marginTop: '0.5rem', fontSize: '0.8rem' }}>Verify Payment</button>
                  </div>
                </div>
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
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Statement for {activeClient.name}</h3>
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
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Generated: Oct 20, 2023</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong>Client:</strong> {activeClient.name}<br />
                    <strong>Status:</strong> {activeClient.status.toUpperCase()}<br />
                    <strong>Joined:</strong> {activeClient.joined}
                  </div>
                </div>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                  <thead>
                    <tr style={{ background: '#f9f9f9', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>Date</th>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd' }}>Description</th>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd', textAlign: 'right' }}>Amount</th>
                      <th style={{ padding: '0.75rem', borderBottom: '1px solid #ddd', textAlign: 'right' }}>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>Oct 15, 2023</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>Monthly Deposit</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee', textAlign: 'right', color: 'green' }}>+₦500.00</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee', textAlign: 'right' }}>₦4,500.00</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>Sep 15, 2023</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee' }}>Monthly Deposit</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee', textAlign: 'right', color: 'green' }}>+₦500.00</td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #eee', textAlign: 'right' }}>₦4,000.00</td>
                    </tr>
                    <tr style={{ fontWeight: 'bold' }}>
                      <td colSpan="3" style={{ padding: '0.75rem', textAlign: 'right' }}>Total Balance:</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>₦4,500.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-outline" style={{ width: 'auto' }} onClick={() => setShowStatementModal(false)}>
                Close
              </button>
              <button className="btn btn-admin" style={{ width: 'auto' }}>
                <FileText size={16} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
