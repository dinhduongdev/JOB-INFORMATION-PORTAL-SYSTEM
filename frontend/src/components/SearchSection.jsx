import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSearch, IoLocationOutline } from 'react-icons/io5';

const SearchSection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [currency, setCurrency] = useState('USD');
  const popularSearches = ['Java', 'ReactJS', '.NET', 'Tester', 'PHP', 'Business Analysis', 'NodeJS', 'Team Management'];

  // Handle form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const params = new URLSearchParams();
      params.append('search', (searchTerm));
      if (salaryMin && salaryMax && !isNaN(salaryMin) && !isNaN(salaryMax) && parseInt(salaryMin) < parseInt(salaryMax)) {
        params.append('salaryMin', parseInt(salaryMin));
        params.append('salaryMax', parseInt(salaryMax));
        params.append('currency', currency);
      }
      navigate(`/job-search?${params.toString()}`);
    }
  };

  // Handle popular search term click
  const handlePopularSearch = (term) => {
    navigate(`/job-search?search=${encodeURIComponent(term)}`);
  };

  return (
    <div className="py-5" style={{ backgroundColor: '#1d1d1d' }}>
      <div className="container text-white text-center">
        <h1 className="fw-bold">949 Việc làm IT cho Developer "Chất"</h1>

        {/* Search Bar */}
        <form className="d-flex mt-4 bg-white rounded p-2" onSubmit={handleSearch}>
          <div className="d-flex align-items-center ps-2 pe-3 text-dark">
            <IoLocationOutline size={20} className="me-2" />
            <span>Tất cả thành phố</span>
          </div>
          <input
            type="text"
            className="form-control border-0 shadow-none"
            placeholder="Nhập từ khoá theo kỹ năng, chức vụ, công ty..."
            style={{ flexGrow: 1 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-danger d-flex align-items-center fw-bold ms-2">
            <IoSearch size={20} className="me-2" />
            Tìm Kiếm
          </button>
        </form>

        {/* Salary Range and Currency */}
        

        {/* Popular Searches */}
        <div className="d-flex align-items-center justify-content-center flex-wrap mt-3">
          <span className="me-3">Mọi người đang tìm kiếm:</span>
          {popularSearches.map((term) => (
            <button
              key={term}
              className="btn btn-sm btn-outline-light m-1"
              onClick={() => handlePopularSearch(term)}
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchSection;