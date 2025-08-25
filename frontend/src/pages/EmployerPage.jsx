
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createJobThunk,
  fetchMyPostedJobsThunk,
  updateJobThunk,
  deleteJobThunk,
} from "../features/post/postSlice";
import JobPostForm from "../components/JobPostForm";
import Pagination from "../components/Pagination"; // Import component phân trang
import '../css/EmployerPage.css';
import { toast } from 'react-toastify'; 




const EmployerPage = () => {
  const dispatch = useDispatch();
  const { myJobs, loading, error } = useSelector((state) => state.post);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // State để theo dõi trang hiện tại

  // useEffect sẽ chạy lại mỗi khi `currentPage` thay đổi
  useEffect(() => {
    // Truyền số trang hiện tại vào thunk để fetch đúng dữ liệu
    dispatch(fetchMyPostedJobsThunk(currentPage));
  }, [dispatch, currentPage]);

  const handleOpenCreateModal = () => { setEditingJob(null); setIsModalOpen(true); };
  const handleOpenEditModal = (job) => { setEditingJob(job); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingJob(null); };

  const handleFormSubmit = (data) => {
    if (editingJob) {
      dispatch(updateJobThunk({ id: editingJob.id, ...data }));
      toast.success('Cập nhật bài đăng thành công!');
    } else {
      dispatch(createJobThunk(data));
      toast.success('Tạo bài đăng thành công!');
    }
    handleCloseModal();
    // Tải lại dữ liệu của trang hiện tại sau khi thực hiện hành động
    setTimeout(() => dispatch(fetchMyPostedJobsThunk(currentPage)), 500);
  };

  const handleDelete = (jobId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài đăng này không?")) {
      dispatch(deleteJobThunk(jobId));
      toast.success('Xóa bài đăng thành công!');
      setTimeout(() => dispatch(fetchMyPostedJobsThunk(currentPage)), 500);
    }
  };
  
  // Hàm xử lý khi người dùng nhấn nút chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Tự động cuộn lên đầu trang
  };

  // Tính toán tổng số trang dựa trên tổng số item và số item mỗi trang
  const itemsPerPage = 2; // Bạn có thể thay đổi hoặc lấy từ API nếu có
  const totalPages = myJobs?.count ? Math.ceil(myJobs.count / itemsPerPage) : 0;

  return (
    <div className="employer-page">
      <div className="container">
        <header className="page-header">
          <h1>Quản lý tuyển dụng</h1>
          <button onClick={handleOpenCreateModal} className="btn btn--primary">
            <span>+</span> Tạo bài đăng
          </button>
        </header>

        {isModalOpen && (
          <JobPostForm jobToEdit={editingJob} onSubmit={handleFormSubmit} onCancel={handleCloseModal} />
        )}

        <div className="job-list">
          {loading && <p className="status-message">Đang tải danh sách công việc...</p>}
          {error && <p className="status-message error">{error}</p>}

          {myJobs?.results?.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-card__main">
                <div className="job-card__info">
                  <h3>{job.name}</h3>
                  <p className="company-name">Công ty: {job.employer?.company_name || 'Không xác định'}</p>
                  <div className="job-card__meta">
                    <span>📍 {job.location}</span>
                    {job.salary?.amount && <span>💰 {job.salary.display_text || `${job.salary.amount} ${job.salary.currency}`}</span>}
                    <span>📅 Hạn nộp: {new Date(job.due_date).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>
                <div className="job-card__actions">
                  <button onClick={() => handleOpenEditModal(job)} className="action-btn">✏️</button>
                  <button onClick={() => handleDelete(job.id)} className="action-btn action-btn--delete">🗑️</button>
                </div>
              </div>

              {job.skills?.length > 0 && (
                <div className="job-card__skills">
                  {job.skills.map(skill => (
                    <span key={skill.id} className="skill-tag">{skill.name}</span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {!loading && myJobs?.results?.length === 0 && (
            <div className="empty-state">
              <h3>Chưa có bài đăng nào</h3>
              <p>Hãy bắt đầu tạo bài đăng tuyển dụng đầu tiên của bạn!</p>
            </div>
          )}
        </div>
        
        {/* Chỉ hiển thị phân trang khi có nhiều hơn 1 trang */}
        {!loading && totalPages > 1 && (
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        )}
      </div>
    </div>
  );
};

export default EmployerPage;