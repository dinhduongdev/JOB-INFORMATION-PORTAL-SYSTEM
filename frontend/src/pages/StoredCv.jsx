import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../css/StoredCv.css";
import {
  BsCloudUpload,
  BsFileEarmarkPdf,
  BsThreeDotsVertical,
  BsEye,
  BsTrash,
} from "react-icons/bs";
import {
  fetchStoredCv,
  uploadCvFile,
  deleteStoredCv,
} from "../features/cv/cvAction";
import { fetchApplicantProfile } from "../features/applicant-profile/applicantProfileActions";
import { toast } from 'react-toastify';



const StoredCv = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { cv, status, error } = useSelector((state) => state.cv);
  const { profile } = useSelector((state) => state.applicantProfile);
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  console.log("vc", cv);

  useEffect(() => {
    if (token) {
      dispatch(fetchApplicantProfile(token));
    }
  }, [dispatch, token]);
  const applicantId = profile?.data?.id || null;

  console.log("====================================");
  console.log("profile", profile);
  console.log("====================================");

  useEffect(() => {
    if (applicantId) {
      dispatch(fetchStoredCv(applicantId));
    }
  }, [dispatch, applicantId]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile && applicantId) {
      dispatch(uploadCvFile({ applicantId, file: selectedFile }))
        .then(() => {
          dispatch(fetchStoredCv(applicantId));
          setSelectedFile(null);
          fileInputRef.current.value = null;
                    toast.success('Upload thành công!'); 
        })
        .catch((error) => {
          toast.error(error?.message || "Upload thất bại!");
        });
    }
  };

  const handleDelete = (cvId) => {
    console.log("Deleting CV", cvId, "for applicant", applicantId);
    if (applicantId) {
      dispatch(deleteStoredCv(applicantId))
        .then(() => {
          dispatch(fetchStoredCv(applicantId));
        })
        .catch((error) => {
          console.error("Delete failed:", error);
        });
    }
  };

  const setDefault = (cvId) => {
    console.log(`Setting CV ${cvId} as default`);
    // dispatch(updateStoredCv({ applicantId, cvData: { isDefault: true, id: cvId } })); // Uncomment and adjust if API supports this
  };

  return (
    <div className="stored-cv-container card">
      <h5 className="card-header">Hồ sơ đính kèm</h5>
      <div className="card-body">
        <div
          className="upload-box"
          onClick={() => fileInputRef.current.click()}
        >
          <BsCloudUpload size={40} className="text-muted" />
          <p className="mt-2">Tải CV từ máy tính của bạn</p>
          <p className="text-muted small">
            Kích thước không quá 5MB. Hỗ trợ định dạng: PDF, DOC, DOCX.
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept=".pdf,.doc,.docx"
          />
        </div>

        {/* Show selected file info so user can confirm before uploading */}
        {selectedFile && (
          <div className="selected-file mt-3 d-flex align-items-center">
            <BsFileEarmarkPdf size={22} className="me-2 text-secondary" />
            <div>
              <div className="fw-semibold">{selectedFile.name}</div>
              <div className="text-muted small">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </div>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-link ms-auto"
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = null;
              }}
            >
              Bỏ chọn
            </button>
          </div>
        )}

        <button
          className="btn btn-primary mt-3"
          onClick={handleUpload}
          disabled={!selectedFile}
        >
          Tải lên
        </button>

        {status === "loading" && <p className="mt-3">Đang tải...</p>}
        {status === "failed" && (
          <p className="mt-3 text-danger">Lỗi: {error}</p>
        )}

        <div className="cv-list mt-4">
          {cv && Array.isArray(cv)
            ? cv.map((cvItem) => (
                <div key={cvItem.id} className="cv-card">
                  <div className="cv-icon">
                    <BsFileEarmarkPdf size={30} />
                  </div>
                  <div className="cv-info">
                    <p className="cv-name">
                      {cvItem.name || `CV_${cvItem.id}`}
                    </p>
                    <p className="cv-date text-muted small">
                      Tải lên vào:{" "}
                      {cvItem.uploadDate ||
                        new Date().toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  {cvItem.isDefault && (
                    <span className="default-badge">Mặc định</span>
                  )}
                  <div className="cv-actions dropdown">
                    <button
                      className="btn btn-light btn-sm"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <BsThreeDotsVertical />
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="#">
                          <BsEye className="me-2" /> Xem
                        </a>
                      </li>
                      {!cvItem.isDefault && (
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            onClick={() => setDefault(cvItem.id)}
                          >
                            Đặt làm mặc định
                          </a>
                        </li>
                      )}
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <a
                          className="dropdown-item text-danger"
                          href="#"
                          onClick={() => handleDelete(cvItem.id)}
                        >
                          <BsTrash className="me-2" /> Xóa
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              ))
            : status === "succeeded" && (
                <p className="mt-3">Không có CV nào được lưu.</p>
              )}
        </div>
      </div>
    </div>
  );
};

export default StoredCv;
