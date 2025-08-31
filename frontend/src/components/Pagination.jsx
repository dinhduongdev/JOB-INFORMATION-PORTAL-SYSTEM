import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="pagination-container">
      <ul className="pagination">
        {/* Nút Previous */}
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination__button"
          >
            &laquo;
          </button>
        </li>

        {/* Các nút số trang */}
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              className={`pagination__button ${currentPage === number ? 'pagination__button--active' : ''}`}
            >
              {number}
            </button>
          </li>
        ))}

        {/* Nút Next */}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination__button"
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;