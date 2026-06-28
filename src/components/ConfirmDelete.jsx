import React, { useEffect, useState } from 'react';
import '../styles/ConfirmDelete.css';

const ConfirmDelete = ({ user, onConfirm, onCancel }) => {
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  const handleConfirm = async () => {
    setDeleting(true);
    await onConfirm(user.id);
    setDeleting(false);
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="modal modal--danger" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
        <div className="modal__header">
          <h2 id="delete-title" className="modal__title">Delete User</h2>
          <button className="modal__close" onClick={onCancel} aria-label="Close">✕</button>
        </div>

        <div className="modal__body confirm-delete__body">
          <div className="confirm-delete__icon" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="confirm-delete__msg">
            Are you sure you want to delete{' '}
            <strong>{user.firstName} {user.lastName}</strong>?
          </p>
          <p className="confirm-delete__hint">
            This action cannot be undone.
          </p>
        </div>

        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onCancel} disabled={deleting}>
            Keep user
          </button>
          <button
            className="btn btn--danger"
            onClick={handleConfirm}
            disabled={deleting}
            autoFocus
          >
            {deleting ? 'Deleting…' : 'Yes, delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
