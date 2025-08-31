import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Spinner, Alert, Table } from "react-bootstrap";

const ApplicantsPage = () => {
  const { jobId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setError("Bạn chưa đăng nhập");
    setLoading(true);
    fetch(`http://localhost:6789/api/v1/jobposts/${jobId}/applicants/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Không thể lấy danh sách ứng viên");
        return res.json();
      })
      .then((data) => {
        setApplicants(Array.isArray(data) ? data : data.results || []);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [jobId]);

  console.log("jobId", jobId);
  console.log("applicants", applicants);

  return (
    <div className="container py-4">
      <h2>Danh sách ứng viên ứng tuyển cho Job #{jobId}</h2>
      {loading && (
        <div className="text-center py-3">
          <Spinner animation="border" variant="primary" />
          <p>Đang tải...</p>
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Avatar</th>
              <th>Số điện thoại</th>
              <th>Ngày sinh</th>
              <th>Địa chỉ</th>
              <th>Mô tả</th>
              <th>CV</th>
            </tr>
          </thead>
          <tbody>
            {applicants.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center">
                  Chưa có ứng viên nào ứng tuyển.
                </td>
              </tr>
            ) : (
              applicants.map((app, idx) => (
                <tr key={app.id}>
                  <td>{idx + 1}</td>
                  <td>{app.full_name}</td>
                  <td>{app.email}</td>
                  <td>
                    {app.avatar_url ? (
                      <img src={app.avatar_url} alt="avatar" style={{ width: 40, height: 40, borderRadius: "50%" }} />
                    ) : "Không có"}
                  </td>
                  <td>{app.phone_number}</td>
                  <td>{app.birth_date}</td>
                  <td>{app.address}</td>
                  <td>{app.description}</td>
                  <td>
                    {app.cv && app.cv.file_url ? (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => window.open(app.cv.file_url, "_blank")}
                      >
                        Xem CV
                      </Button>
                    ) : "Không có CV"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ApplicantsPage;
