import React, { useEffect } from 'react';
import { FiX } from '../../components/common/Icons';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onClose, confirmText = 'Confirm Delete', cancelText = 'Cancel', hideCancel = false }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><FiX /></button>
        <h2 className="modal-title">{title}</h2>
        <p className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-actions">
          {!hideCancel && (
            <button 
              className="btn-confirm-cancel"
              onClick={onClose}
            >
              {cancelText}
            </button>
          )}
          <button 
            className="btn-confirm-danger"
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
