import { createContext, useContext, useState } from 'react';
import NotificationModal from '../components/NotificationModal';
import ConfirmModal from '../components/ConfirmModal';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [loading, setLoading] = useState(false);


  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const requestConfirmation = (message, onConfirm) => {
    setConfirmDialog({ message, onConfirm });
  };

  const handleConfirm = async () => {
    if (confirmDialog?.onConfirm) {
      setLoading(true);
      try {
        await confirmDialog.onConfirm();
      } finally {
        setLoading(false);
      }
    }
    setConfirmDialog(null);
  };


  const handleCancel = () => {
    setConfirmDialog(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, requestConfirmation }}>
      {children}
      {notification && (
        <NotificationModal 
          message={notification.message} 
          type={notification.type} 
          onClose={closeNotification} 
        />
      )}
      {confirmDialog && (
        <ConfirmModal 
          message={confirmDialog.message} 
          onConfirm={handleConfirm} 
          onCancel={handleCancel}
          loading={loading}
        />
      )}

    </NotificationContext.Provider>
  );
};
