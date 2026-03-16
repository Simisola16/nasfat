import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export default function NotificationModal({ message, type, onClose }) {
  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle size={48} color="#10b981" />;
      case 'error': return <AlertCircle size={48} color="#ef4444" />;
      default: return <Info size={48} color="var(--primary)" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      default: return 'Notification';
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          {getIcon()}
        </div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{getTitle()}</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5' }}>
          {message}
        </p>
        <button className="btn btn-primary" onClick={onClose}>
          Dismiss
        </button>
      </div>
    </div>
  );
}
