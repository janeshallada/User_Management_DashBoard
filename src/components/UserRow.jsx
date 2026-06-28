import React from 'react';
import '../styles/UserRow.css';

const DEPT_COLORS = {
  Engineering: '#e0f0ff',
  Marketing: '#fde8ff',
  Sales: '#e8fff0',
  HR: '#fff8e0',
  Finance: '#ffeae8',
  IT: '#e8f0ff',
  Design: '#fff0f8',
  Operations: '#f0ffe8',
};

const UserRow = ({ user, onEdit, onDelete }) => {
  const initials = `${user.firstName[0] || ''}${user.lastName[0] || ''}`.toUpperCase();
  const deptColor = DEPT_COLORS[user.department] || '#f0f0f0';

  return (
    <tr className="user-row">
      <td className="user-row__cell user-row__cell--id">
        <span className="user-row__id">#{user.id}</span>
      </td>
      <td className="user-row__cell user-row__cell--name">
        <div className="user-row__name-group">
          <span className="user-row__avatar" aria-hidden="true">{initials}</span>
          <span className="user-row__fullname">
            {user.firstName} {user.lastName}
          </span>
        </div>
      </td>
      <td className="user-row__cell user-row__cell--fn">{user.firstName}</td>
      <td className="user-row__cell user-row__cell--ln">{user.lastName}</td>
      <td className="user-row__cell user-row__cell--email">
        <a href={`mailto:${user.email}`} className="user-row__email">{user.email}</a>
      </td>
      <td className="user-row__cell user-row__cell--dept">
        <span className="user-row__dept-badge" style={{ background: deptColor }}>
          {user.department}
        </span>
      </td>
      <td className="user-row__cell user-row__cell--actions">
        <div className="user-row__actions">
          <button
            className="user-row__action user-row__action--edit"
            onClick={() => onEdit(user)}
            aria-label={`Edit ${user.firstName} ${user.lastName}`}
            title="Edit user"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </button>
          <button
            className="user-row__action user-row__action--delete"
            onClick={() => onDelete(user)}
            aria-label={`Delete ${user.firstName} ${user.lastName}`}
            title="Delete user"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserRow;
