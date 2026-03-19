import { HelpCircle } from 'lucide-react';

export default function ConfirmModal({ message, onConfirm, onCancel, loading }) {
  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <HelpCircle size={48} color="var(--accent-orange)" />
        </div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Are you sure?</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            className="btn btn-outline" 
            onClick={onCancel} 
            disabled={loading}
            style={{ width: 'auto', flex: 1 }}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={onConfirm} 
            disabled={loading}
            style={{ width: 'auto', flex: 1, background: 'linear-gradient(135deg, var(--accent-orange), var(--accent-orange-dark))', boxShadow: '0 4px 15px rgba(240, 90, 40, 0.3)' }}
          >
            {loading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
