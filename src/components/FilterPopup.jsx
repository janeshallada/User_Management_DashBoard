import React, { useState, useEffect, useRef } from 'react';
import { DEPARTMENTS } from '../utils/constants';
import '../styles/FilterPopup.css';

const EMPTY_FILTERS = {
  firstName: '',
  lastName: '',
  email: '',
  department: '',
};

const FilterPopup = ({ activeFilters, onApply, onClear }) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ ...EMPTY_FILTERS, ...activeFilters });
  const popupRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleOpen = () => {
    setDraft({ ...EMPTY_FILTERS, ...activeFilters });
    setOpen(true);
  };

  const handleApply = () => {
    onApply(draft);
    setOpen(false);
  };

  const handleClear = () => {
    setDraft(EMPTY_FILTERS);
    onClear();
    setOpen(false);
  };

  const activeCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className="filter" ref={popupRef}>
      <button
        className={`btn btn--secondary filter__toggle ${activeCount > 0 ? 'filter__toggle--active' : ''}`}
        onClick={handleOpen}
        aria-expanded={open}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        Filters
        {activeCount > 0 && <span className="filter__badge">{activeCount}</span>}
      </button>

      {open && (
        <div className="filter__popup" role="dialog" aria-label="Filter options">
          <div className="filter__popup-header">
            <h3 className="filter__popup-title">Filter Users</h3>
            <button className="filter__close" onClick={() => setOpen(false)} aria-label="Close filter">✕</button>
          </div>

          <div className="filter__popup-body">
            <div className="filter__field">
              <label className="filter__label" htmlFor="filter-fn">First Name</label>
              <input
                id="filter-fn"
                className="filter__input"
                type="text"
                placeholder="e.g. Leanne"
                value={draft.firstName}
                onChange={(e) => setDraft((d) => ({ ...d, firstName: e.target.value }))}
              />
            </div>

            <div className="filter__field">
              <label className="filter__label" htmlFor="filter-ln">Last Name</label>
              <input
                id="filter-ln"
                className="filter__input"
                type="text"
                placeholder="e.g. Graham"
                value={draft.lastName}
                onChange={(e) => setDraft((d) => ({ ...d, lastName: e.target.value }))}
              />
            </div>

            <div className="filter__field">
              <label className="filter__label" htmlFor="filter-email">Email</label>
              <input
                id="filter-email"
                className="filter__input"
                type="text"
                placeholder="e.g. name@example.com"
                value={draft.email}
                onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
              />
            </div>

            <div className="filter__field">
              <label className="filter__label" htmlFor="filter-dept">Department</label>
              <select
                id="filter-dept"
                className="filter__input filter__select"
                value={draft.department}
                onChange={(e) => setDraft((d) => ({ ...d, department: e.target.value }))}
              >
                <option value="">All departments</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter__popup-footer">
            <button className="btn btn--ghost" onClick={handleClear}>Clear all</button>
            <button className="btn btn--primary" onClick={handleApply}>Apply filters</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPopup;
