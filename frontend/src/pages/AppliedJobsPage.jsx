import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AppliedJobsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/applications/my-applications/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setApplications(response.data);
      } catch (err) {
        setError("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [token]);

  if (loading)
    return (
      <div
        className="container mt-5 d-flex justify-content-center align-items-center"
        style={{ minHeight: "40vh" }}
      >
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-3">Đang tải dữ liệu...</span>
      </div>
    );
  if (error)
    return (
      <div className="container mt-5 text-danger text-center">{error}</div>
    );

  return (
    <div className="container mt-5">
      <div className="d-flex align-items-center mb-4 gap-2">
        <h2 className="fw-bold mb-0">Công việc bạn đã ứng tuyển</h2>
        <span className="badge bg-danger ms-2" style={{ fontSize: "1rem" }}>
          {applications.length}
        </span>
      </div>
      {applications.length === 0 ? (
        <div className="alert alert-info text-center py-4 rounded-3 shadow-sm">
          Bạn chưa apply công việc nào.
        </div>
      ) : (
        <div className="row g-4">
          {applications.map((app) => (
            <div className="col-12 col-md-6 col-lg-4" key={app.id}>
              <div className="card h-100 shadow-sm border-0 position-relative">
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                  <span className="badge bg-success">
                    {app.job_post.is_active ? "Đang tuyển" : "Đã đóng"}
                  </span>
                  <span className="text-muted" style={{ fontSize: "0.9rem" }}>
                    {new Date(app.applied_at).toLocaleDateString()}
                    <br />
                    <span style={{ fontSize: "0.8rem" }}>
                      Lúc {new Date(app.applied_at).toLocaleTimeString()}
                    </span>
                  </span>
                </div>
                <div className="card-body">
                  <h5 className="card-title fw-bold text-danger mb-2">
                    {app.job_post.name}
                  </h5>
                  <p className="mb-1">
                    <i className="bi bi-building"></i> <strong>Công ty:</strong>{" "}
                    {app.job_post.employer.company_name}
                  </p>
                  <p className="mb-1">
                    <i className="bi bi-geo-alt"></i> <strong>Địa điểm:</strong>{" "}
                    {app.job_post.location}
                  </p>
                  <p className="mb-1">
                    <i className="bi bi-cash-stack"></i> <strong>Lương:</strong>{" "}
                    <span className="text-success">
                      {app.job_post.salary.amount}{" "}
                      {app.job_post.salary.currency}
                    </span>
                  </p>
                  <p className="mb-1">
                    <i className="bi bi-file-earmark-text"></i>{" "}
                    <strong>CV:</strong>{" "}
                    <a
                      href={app.cv.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-danger"
                    >
                      Xem CV
                    </a>
                  </p>
                  <p className="mb-1">
                    <i className="bi bi-envelope"></i>{" "}
                    <strong>Thư ứng tuyển:</strong>{" "}
                    <span className="text-muted">{app.cover_letter}</span>
                  </p>
                  <div className="mt-3 d-flex flex-wrap gap-2">
                    {app.job_post.titles?.map((title) => (
                      <span key={title.id} className="badge bg-primary">
                        {title.name}
                      </span>
                    ))}
                    {app.job_post.skills?.map((skill) => (
                      <span
                        key={skill.id}
                        className="badge bg-warning text-dark"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center">
                  <Link
                    to={`/job/${app.job_post.id}`}
                    className="btn btn-outline-danger btn-sm"
                  >
                    Xem chi tiết công việc
                  </Link>
                  <span className="text-muted" style={{ fontSize: "0.9rem" }}>
                    Hạn nộp:{" "}
                    {new Date(app.job_post.due_date).toLocaleDateString()}
                  </span>
                </div>
                <span className="position-absolute top-0 end-0 m-2">
                  <img
                    src="/src/assets/icon-briefcase.png"
                    alt="job"
                    style={{ width: 32, height: 32 }}
                  />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobsPage;
