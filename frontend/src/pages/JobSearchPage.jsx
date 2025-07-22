import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import '../css/JobSearchPage.css';
import { BsSearch, BsGeoAlt, BsHeart, BsChevronDown, BsBookmarkFill } from 'react-icons/bs';
import { fetchJobs } from '../features/job/jobActions';

const JobSearchPage = () => {
  const dispatch = useDispatch();
  const { jobs, status } = useSelector((state) => state.job || { jobs: [], status: 'idle' });
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || 'javascript');

  // Update search term when URL changes
  useEffect(() => {
    const search = searchParams.get('search') || 'javascript';
    setSearchTerm(search);
  }, [searchParams]);

  // Fetch jobs when searchTerm or status changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && status === 'idle') {
      dispatch(fetchJobs({ token, search: searchTerm }));
    }
  }, [dispatch, status, searchTerm]);

  // Set the first job as selected when jobs load
  useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs, selectedJob]);

  // Handle search input change and update URL
  const handleSearch = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      setSearchParams({ search: searchTerm });
      dispatch(fetchJobs({ token, search: searchTerm }));
    }
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
            <button type="submit" className="btn btn-red btn-search">
              <BsSearch className="me-2" /> Tìm kiếm
            </button>
          </form>
        </div>
      </div>

      <main className="container mt-4">
        <div className="results-header">
          <h4 className="fw-bold">{jobs.length} việc làm tại Việt Nam</h4>
          <div className="filters">
            <button className="btn btn-filter">Cấp bậc <BsChevronDown /></button>
            <button className="btn btn-filter">Hình thức làm việc <BsChevronDown /></button>
            <button className="btn btn-filter">Mức lương <BsChevronDown /></button>
            <button className="btn btn-filter">Loại hình công việc <BsChevronDown /></button>
            <button className="btn btn-outline-secondary">Bộ lọc</button>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-5">
            <div className="job-list">
              {jobs.map((job) => (
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
                  <p className="salary-small">{job.salary?.display_text || 'Negotiable'}</p>
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
                  <button className="btn btn-red flex-grow-1">Ứng tuyển</button>
                  <button className="btn btn-outline-secondary">
                    <BsHeart />
                  </button>
                </div>
                <hr />
                <p>
                  <strong>Địa điểm:</strong> {selectedJob.location}
                </p>
                <p>
                  <strong>Đăng vào:</strong>{' '}
                  {new Date(selectedJob.created_at).toLocaleDateString('vi-VN', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <p>
                  <strong>Hạn nộp:</strong>{' '}
                  {new Date(selectedJob.due_date).toLocaleDateString('vi-VN', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <p>
                  <strong>Yêu cầu:</strong> {selectedJob.requirements}
                </p>
                <p>
                  <strong>Mô tả:</strong> {selectedJob.description}
                </p>
                <p>
                  <strong>Mức lương:</strong> {selectedJob.salary?.display_text || 'Negotiable'}
                </p>
                <p>
                  <strong>Kỹ năng:</strong>
                </p>
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
    </div>
  );
};

export default JobSearchPage;