import React from 'react';
import UserRow from './UserRow';
import { SORT_ORDER } from '../utils/constants';
import '../styles/UserTable.css';

const SortIcon = ({ field, sortField, sortOrder }) => {
  const isActive = field === sortField;
  if (!isActive) return <span className="sort-icon sort-icon--idle">↕</span>;
  return (
    <span className="sort-icon sort-icon--active">
      {sortOrder === SORT_ORDER.ASC ? '↑' : '↓'}
    </span>
  );
};

const COLUMNS = [
  { label: 'ID', field: 'id', className: 'col-id' },
  { label: 'Name', field: 'firstName', className: 'col-name' },
  { label: 'First Name', field: 'firstName', className: 'col-fn' },
  { label: 'Last Name', field: 'lastName', className: 'col-ln' },
  { label: 'Email', field: 'email', className: 'col-email' },
  { label: 'Department', field: 'department', className: 'col-dept' },
];

const UserTable = ({ users, sortField, sortOrder, onSort, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="table-state table-state--loading">
        <div className="spinner" />
        <p>Loading users…</p>
      </div>
    );
  }

  if (!loading && users.length === 0) {
    return (
      <div className="table-state table-state--empty">
        <span className="table-state__icon">👤</span>
        <p className="table-state__msg">No users found.</p>
        <p className="table-state__hint">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="user-table" aria-label="User management table">
        <thead className="user-table__head">
          <tr>
            {COLUMNS.map(({ label, field, className }) => (
              <th
                key={`${label}-${field}`}
                className={`user-table__th ${className}`}
                onClick={() => onSort(field)}
                aria-sort={
                  sortField === field
                    ? sortOrder === SORT_ORDER.ASC ? 'ascending' : 'descending'
                    : 'none'
                }
                role="columnheader"
              >
                <span className="user-table__th-inner">
                  {label}
                  <SortIcon field={field} sortField={sortField} sortOrder={sortOrder} />
                </span>
              </th>
            ))}
            <th className="user-table__th col-actions">Actions</th>
          </tr>
        </thead>
        <tbody className="user-table__body">
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
