import React, { useState, useMemo, useCallback } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import FilterPopup from './components/FilterPopup';
import UserTable from './components/UserTable';
import Pagination from './components/Pagination';
import UserForm from './components/UserForm';
import ConfirmDelete from './components/ConfirmDelete';
import { useUsers } from './hooks/useUsers';
import { matchesQuery } from './utils/helpers';
import { DEFAULT_PAGE_SIZE, SORT_FIELDS, SORT_ORDER } from './utils/constants';
import './styles/global.css';
import './App.css';

const EMPTY_FILTERS = { firstName: '', lastName: '', email: '', department: '' };

function App() {
  // ── Data layer ──
  const { users, loading, error, setError, addUser, editUser, removeUser } = useUsers();

  // ── UI state ──
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState(EMPTY_FILTERS);
  const [sortField, setSortField] = useState(SORT_FIELDS.ID);
  const [sortOrder, setSortOrder] = useState(SORT_ORDER.ASC);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // Modal state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  // ── Toast notifications ──
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  // ── Sort handler ──
  const handleSort = useCallback((field) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortOrder((o) => (o === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC));
        return prev;
      }
      setSortOrder(SORT_ORDER.ASC);
      return field;
    });
    setCurrentPage(1);
  }, []);

  // ── Filter apply/clear ──
  const handleApplyFilters = useCallback((filters) => {
    setActiveFilters(filters);
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setActiveFilters(EMPTY_FILTERS);
    setCurrentPage(1);
  }, []);

  // ── Search ──
  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  // ── Page size change ──
  const handlePageSizeChange = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  // ── CRUD handlers ──
  const handleAddSubmit = useCallback(async (formData) => {
    const result = await addUser(formData);
    if (result.success) {
      setShowAddForm(false);
      showToast('User added successfully.');
    }
    return result;
  }, [addUser, showToast]);

  const handleEditSubmit = useCallback(async (formData) => {
    const result = await editUser(editingUser.id, formData);
    if (result.success) {
      setEditingUser(null);
      showToast('User updated successfully.');
    }
    return result;
  }, [editUser, editingUser, showToast]);

  const handleDeleteConfirm = useCallback(async (id) => {
    const result = await removeUser(id);
    if (result.success) {
      setDeletingUser(null);
      showToast('User deleted.', 'info');
    }
    return result;
  }, [removeUser, showToast]);

  // ── Derived data (filter → search → sort → paginate) ──
  const processedUsers = useMemo(() => {
    let result = [...users];

    // 1. Apply filter popup criteria
    if (activeFilters.firstName) {
      result = result.filter((u) => matchesQuery(u.firstName, activeFilters.firstName));
    }
    if (activeFilters.lastName) {
      result = result.filter((u) => matchesQuery(u.lastName, activeFilters.lastName));
    }
    if (activeFilters.email) {
      result = result.filter((u) => matchesQuery(u.email, activeFilters.email));
    }
    if (activeFilters.department) {
      result = result.filter((u) => u.department === activeFilters.department);
    }

    // 2. Apply search query (across firstName, lastName, email)
    if (searchQuery.trim()) {
      result = result.filter(
        (u) =>
          matchesQuery(u.firstName, searchQuery) ||
          matchesQuery(u.lastName, searchQuery) ||
          matchesQuery(u.email, searchQuery)
      );
    }

    // 3. Sort
    result.sort((a, b) => {
      const valA = String(a[sortField] ?? '').toLowerCase();
      const valB = String(b[sortField] ?? '').toLowerCase();
      const cmp = sortField === 'id'
        ? a.id - b.id
        : valA.localeCompare(valB);
      return sortOrder === SORT_ORDER.ASC ? cmp : -cmp;
    });

    return result;
  }, [users, activeFilters, searchQuery, sortField, sortOrder]);

  // Paginate
  const totalItems = processedUsers.length;
  const startIndex = (currentPage - 1) * pageSize;
  const visibleUsers = processedUsers.slice(startIndex, startIndex + pageSize);

  return (
    <div className="app">
      <Header onAddUser={() => setShowAddForm(true)} />

      <main className="app__main">
        <div className="app__container">

          {/* ── Error Banner ── */}
          {error && (
            <div className="alert alert--error" role="alert">
              <span className="alert__icon">⚠</span>
              <span>{error}</span>
              <button className="alert__close" onClick={() => setError(null)} aria-label="Dismiss error">✕</button>
            </div>
          )}

          {/* ── Toast ── */}
          {toast && (
            <div className={`toast toast--${toast.type}`} role="status" aria-live="polite">
              <span>{toast.type === 'success' ? '✓' : 'ℹ'}</span>
              {toast.message}
            </div>
          )}

          {/* ── Toolbar ── */}
          <div className="toolbar">
            <SearchBar value={searchQuery} onChange={handleSearchChange} />
            <div className="toolbar__right">
              <FilterPopup
                activeFilters={activeFilters}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
              />
              <span className="toolbar__count">
                {loading ? '…' : `${totalItems} user${totalItems !== 1 ? 's' : ''}`}
              </span>
            </div>
          </div>

          {/* ── Table ── */}
          <UserTable
            users={visibleUsers}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            onEdit={(user) => setEditingUser(user)}
            onDelete={(user) => setDeletingUser(user)}
            loading={loading}
          />

          {/* ── Pagination ── */}
          {!loading && totalItems > 0 && (
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>
      </main>

      {/* ── Add User Modal ── */}
      {showAddForm && (
        <UserForm
          user={null}
          onSubmit={handleAddSubmit}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* ── Edit User Modal ── */}
      {editingUser && (
        <UserForm
          user={editingUser}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditingUser(null)}
        />
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deletingUser && (
        <ConfirmDelete
          user={deletingUser}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingUser(null)}
        />
      )}
    </div>
  );
}

export default App;
