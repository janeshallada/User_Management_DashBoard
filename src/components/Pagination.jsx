import React from 'react';
import { PAGE_SIZE_OPTIONS } from '../utils/constants';
import '../styles/Pagination.css';

const Pagination = ({ currentPage, pageSize, totalItems, onPageChange, onPageSizeChange }) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Build visible page numbers (ellipsis-aware)
  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '…', totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '…', currentPage - 1, currentPage, currentPage + 1, '…', totalPages);
    }
    return pages;
  };

  return (
    <div className="pagination">
      <div className="pagination__info">
        <span>
          {totalItems === 0
            ? 'No results'
            : `Showing ${startItem}–${endItem} of ${totalItems} users`}
        </span>
      </div>

      <div className="pagination__controls">
        <button
          className="pagination__btn pagination__btn--nav"
          onClick={() => onPageChange(1)}
          disabled={!canGoPrev}
          aria-label="First page"
          title="First page"
        >«</button>
        <button
          className="pagination__btn pagination__btn--nav"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrev}
          aria-label="Previous page"
          title="Previous page"
        >‹</button>

        {getPageNumbers().map((page, idx) =>
          page === '…' ? (
            <span key={`ellipsis-${idx}`} className="pagination__ellipsis">…</span>
          ) : (
            <button
              key={page}
              className={`pagination__btn ${page === currentPage ? 'pagination__btn--active' : ''}`}
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}

        <button
          className="pagination__btn pagination__btn--nav"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          aria-label="Next page"
          title="Next page"
        >›</button>
        <button
          className="pagination__btn pagination__btn--nav"
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoNext}
          aria-label="Last page"
          title="Last page"
        >»</button>
      </div>

      <div className="pagination__size">
        <label htmlFor="page-size" className="pagination__size-label">Rows per page:</label>
        <select
          id="page-size"
          className="pagination__size-select"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {PAGE_SIZE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;
