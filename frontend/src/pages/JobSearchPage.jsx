import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import '../css/JobSearchPage.css';
import { BsSearch, BsGeoAlt, BsHeart, BsBookmarkFill } from 'react-icons/bs';
import { fetchJobs } from '../features/job/jobActions';
import Pagination from '../components/Pagination'; // Import component Pagination
import ApplicationModal from '../components/ApplicationModal';

const JobSearchPage = () => {
  const dispatch = useDispatch();
  const { jobs, status } = useSelector((state) => state.job || { jobs: { count: 0, results: [] }, status: 'idle' });
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  // Lấy các tham số từ URL
  const currentPage = parseInt(searchParams.get('page') || '1');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [salaryMin, setSalaryMin] = useState(searchParams.get('salary_amount_gte') || '');
  const [salaryMax, setSalaryMax] = useState(searchParams.get('salary_amount_lte') || '');
  const [currency, setCurrency] = useState(searchParams.get('salary_currency') || 'USD');

  // Cập nhật state của các ô input khi URL thay đổi (ví dụ: khi nhấn nút back/forward)
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setSalaryMin(searchParams.get('salary_amount_gte') || '');
    setSalaryMax(searchParams.get('salary_amount_lte') || '');
    setCurrency(searchParams.get('salary_currency') || 'USD');
  }, [searchParams]);

  // Fetch dữ liệu jobs khi bất kỳ tham số nào trên URL thay đổi
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchJobs({
        token,
        page: currentPage,
        search: searchTerm,
        salaryMin: salaryMin ? parseInt(salaryMin) : null,
        salaryMax: salaryMax ? parseInt(salaryMax) : null,
        currency
      }));
    }
  }, [dispatch, searchTerm, salaryMin, salaryMax, currency, currentPage]);

  // Tự động chọn job đầu tiên trong danh sách khi dữ liệu được tải
  useEffect(() => {
    if (jobs.results && jobs.results.length > 0) {
      if (!selectedJob || !jobs.results.find(j => j.id === selectedJob.id)) {
        setSelectedJob(jobs.results[0]);
      }
    } else {
      setSelectedJob(null);
    }
  }, [jobs, selectedJob]);

  // Xử lý khi người dùng nhấn nút tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (salaryMin && salaryMax) {
      params.set('salary_currency', currency);
      params.set('salary_amount_gte', salaryMin);
      params.set('salary_amount_lte', salaryMax);
    }
    params.set('page', '1'); // Luôn reset về trang 1 khi thực hiện tìm kiếm mới
    setSearchParams(params);
  };

  // Xử lý khi người dùng chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage > 0) {
      const params = new URLSearchParams(searchParams);
      params.set('page', newPage);
      setSearchParams(params);
      window.scrollTo(0, 0); // Cuộn lên đầu trang
    }
  };

  // Xử lý xóa bộ lọc lương
  const handleClearSalaryFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('salary_currency');
    params.delete('salary_amount_gte');
    params.delete('salary_amount_lte');
    setSearchParams(params);
  };

  // Tính toán tổng số trang
  const itemsPerPage = 2; // Giả sử API trả về 2 item mỗi trang
  const totalPages = Math.ceil((jobs?.count || 0) / itemsPerPage);

  const handleApply = () => {
    if (!selectedJob) return;
    setShowApplicationModal(true);
  };

  const handleCloseModal = () => {
    setShowApplicationModal(false);
  };

  return (
    <div className="job-search-page">
      <div className="search-hero">
        <div className="container">
          <form className="search-box" onSubmit={handleSearch}>
            <div className="search-input-group">
              <BsGeoAlt />
              <select className="form-control-plaintext">
                <option>Tất cả thành phố</option>
              </select>
            </div>
            <div className="search-input-group flex-grow-1">
              <input
                type="text"
                className="form-control-plaintext"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tên công việc, vị trí, công ty..."
              />
            </div>
            <button
              type="submit"
              className="btn btn-red btn-search"
              style={{ width: '200px' }}
            >
              <BsSearch className="me-2" /> Tìm kiếm
            </button>
          </form>
          <div className="mt-3 text-white d-flex align-items-center flex-wrap">
            <label className="me-2">Mức lương:</label>
            <select
              className="form-select form-select-sm d-inline-block w-auto me-2"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="VND">VND</option>
            </select>
            <input
              type="number"
              className="form-control form-control-sm d-inline-block w-auto me-2"
              placeholder="Tối thiểu"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              min="0"
            />
            <input
              type="number"
              className="form-control form-control-sm d-inline-block w-auto me-2"
              placeholder="Tối đa"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              min="0"
            />
            {salaryMin && salaryMax && (
              <button
                type="button"
                className="btn btn-outline-light btn-sm"
                onClick={handleClearSalaryFilter}
              >
                Hủy lọc lương
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="container mt-4">
        <div className="row">
          <div className="col-lg-5">
            <div className="job-list">
              {status === 'loading' && <p>Đang tải...</p>}
              {status === 'succeeded' && jobs.results.map((job) => (
                <div
                  key={job.id}
                  className={`job-card ${selectedJob?.id === job.id ? 'active' : ''}`}
                  onClick={() => setSelectedJob(job)}
                >
                  {job.is_active && <div className="hot-badge">HOT</div>}
                  <div className="d-flex align-items-center mb-2">
                    <img
                      src={job.employer?.company_logo || 'https://via.placeholder.com/50'}
                      alt={`${job.employer?.company_name} logo`}
                      className="company-logo-small"
                    />
                    <div>
                      <p className="job-title-small mb-0">{job.expertise?.name || job.name}</p>
                      <p className="company-name-small mb-0">{job.employer?.company_name}</p>
                    </div>
                  </div>
                  <div className="badge-love">
                    <BsBookmarkFill /> {job.salary?.display_text || "You'll love it"}
                  </div>
                  <p className="salary-small">{job.salary?.display_text || 'Thỏa thuận'}</p>
                  <div className="skills-small">
                    {job.skills.map((skill) => (
                      <span key={skill.id} className="skill-tag">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>

          </div>
          <div className="col-lg-7">
            {selectedJob && (
              <div className="job-detail-card">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="fw-bold">{selectedJob.expertise?.name || selectedJob.name}</h5>
                    <p className="text-muted">{selectedJob.employer?.company_name}</p>
                  </div>
                  <img
                    src={selectedJob.employer?.company_logo || 'https://via.placeholder.com/100'}
                    alt={`${selectedJob.employer?.company_name} logo`}
                    className="company-logo-large"
                  />
                </div>
                <div className="d-flex gap-3 my-3">
                  <button className="btn btn-red flex-grow-1" onClick={handleApply}>Ứng tuyển</button>
                  <button className="btn btn-outline-secondary">
                    <BsHeart />
                  </button>
                </div>
                <hr />
                <p><strong>Địa điểm:</strong> {selectedJob.location}</p>
                <p><strong>Đăng vào:</strong> {new Date(selectedJob.created_at).toLocaleDateString('vi-VN')}</p>
                <p><strong>Hạn nộp:</strong> {new Date(selectedJob.due_date).toLocaleDateString('vi-VN')}</p>
                <p><strong>Yêu cầu:</strong> {selectedJob.requirements}</p>
                <p><strong>Mô tả:</strong> {selectedJob.description}</p>
                <p><strong>Mức lương:</strong> {selectedJob.salary?.display_text || 'Thỏa thuận'}</p>
                <p><strong>Kỹ năng:</strong></p>
                <div className="skills-large">
                  {selectedJob.skills.map((skill) => (
                    <span key={skill.id} className="skill-tag">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <ApplicationModal
        show={showApplicationModal}
        onHide={handleCloseModal}
        job={selectedJob}
      />
    </div>
  );
};

export default JobSearchPage;