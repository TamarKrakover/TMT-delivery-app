import React, { useEffect } from 'react';
import { FiX } from '../../components/common/Icons';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onClose }) => {
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
        <button className="modal-close" onClick={onClose}><FiX /></button>
        <h2 className="modal-title">{title}</h2>
        <p style={{ margin: '20px 0', color: 'var(--text-color)' }}>{message}</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button 
            style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'transparent', color: 'var(--text-color)', cursor: 'pointer' }} 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            style={{ padding: '8px 16px', border: 'none', borderRadius: '8px', background: 'var(--danger)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }} 
            onClick={() => { onConfirm(); onClose(); }}
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
