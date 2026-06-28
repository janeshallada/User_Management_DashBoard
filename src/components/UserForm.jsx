import React, { useState, useEffect, useRef } from 'react';
import { DEPARTMENTS } from '../utils/constants';
import { validateUserForm, isFormValid } from '../utils/validators';
import '../styles/UserForm.css';

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  department: '',
};

const UserForm = ({ user, onSubmit, onCancel }) => {
  const isEditing = Boolean(user);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        department: user.department || '',
      });
    } else {
      setFormData(EMPTY_FORM);
    }
    setErrors({});
    // Focus first input on open
    setTimeout(() => firstInputRef.current?.focus(), 50);
  }, [user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateUserForm(formData);
    if (!isFormValid(validationErrors)) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    const result = await onSubmit(formData);
    setSubmitting(false);
    if (result?.success) {
      setFormData(EMPTY_FORM);
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal__header">
          <h2 id="modal-title" className="modal__title">
            {isEditing ? 'Edit User' : 'Add New User'}
          </h2>
          <button className="modal__close" onClick={onCancel} aria-label="Close modal">✕</button>
        </div>

        <div className="modal__body">
          <div className="form-row">
            <div className="form-field">
              <label className="form-label" htmlFor="fn">
                First Name <span className="form-label__required">*</span>
              </label>
              <input
                id="fn"
                ref={firstInputRef}
                className={`form-input ${errors.firstName ? 'form-input--error' : ''}`}
                type="text"
                placeholder="e.g. Leanne"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                aria-describedby={errors.firstName ? 'fn-error' : undefined}
              />
              {errors.firstName && (
                <p id="fn-error" className="form-error" role="alert">{errors.firstName}</p>
              )}
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="ln">
                Last Name <span className="form-label__required">*</span>
              </label>
              <input
                id="ln"
                className={`form-input ${errors.lastName ? 'form-input--error' : ''}`}
                type="text"
                placeholder="e.g. Graham"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                aria-describedby={errors.lastName ? 'ln-error' : undefined}
              />
              {errors.lastName && (
                <p id="ln-error" className="form-error" role="alert">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="email">
              Email Address <span className="form-label__required">*</span>
            </label>
            <input
              id="email"
              className={`form-input ${errors.email ? 'form-input--error' : ''}`}
              type="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="form-error" role="alert">{errors.email}</p>
            )}
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="dept">
              Department <span className="form-label__required">*</span>
            </label>
            <select
              id="dept"
              className={`form-input form-select ${errors.department ? 'form-input--error' : ''}`}
              value={formData.department}
              onChange={(e) => handleChange('department', e.target.value)}
              aria-describedby={errors.department ? 'dept-error' : undefined}
            >
              <option value="">Select a department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {errors.department && (
              <p id="dept-error" className="form-error" role="alert">{errors.department}</p>
            )}
          </div>

          <p className="form-required-note">
            <span className="form-label__required">*</span> Required fields
          </p>
        </div>

        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
          <button
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Add user'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
