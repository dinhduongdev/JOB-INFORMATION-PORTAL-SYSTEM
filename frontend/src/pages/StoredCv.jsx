import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../css/StoredCv.css'; // Tệp CSS cho component này
import { BsCloudUpload, BsFileEarmarkPdf, BsThreeDotsVertical, BsEye, BsTrash } from 'react-icons/bs';
import { fetchStoredCv, uploadCvFile, deleteStoredCv } from '../features/cv/cvAction'; // Adjust the path

const StoredCv = () => {
  const dispatch = useDispatch();
  const { cv, status, error } = useSelector((state) => state.cv);
  const fileInputRef = useRef(null);
  const applicantId = 1; // Replace with dynamic applicant ID (e.g., from auth context)

  // State to manage the selected file for upload
  const [selectedFile, setSelectedFile] = useState(null);
console.log("vc", cv);

  // Fetch CVs when component mounts
  useEffect(() => {
    dispatch(fetchStoredCv(applicantId));
  }, [dispatch, applicantId]);

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Handle file upload
  const handleUpload = () => {
    if (selectedFile && applicantId) {
      dispatch(uploadCvFile({ applicantId, file: selectedFile }))
        .then(() => {
          dispatch(fetchStoredCv(applicantId)); // Refresh CV list after upload
          setSelectedFile(null); // Clear the file input
          fileInputRef.current.value = null; // Reset file input
        })
        .catch((error) => {
          console.error('Upload failed:', error);
        });
    }
  };

  // Handle delete CV
  const handleDelete = (cvId) => {
    if (applicantId) {
      dispatch(deleteStoredCv(applicantId)) // Assuming delete uses applicantId to identify the CV
        .then(() => {
          dispatch(fetchStoredCv(applicantId)); // Refresh CV list after deletion
        })
        .catch((error) => {
          console.error('Delete failed:', error);
        });
    }
  };

  // Handle setting default CV (placeholder logic - adjust based on API)
  const setDefault = (cvId) => {
    // Note: This assumes the API handles default CV setting via update or a separate endpoint
    // For now, we'll simulate by updating local state; replace with actual API call
    console.log(`Setting CV ${cvId} as default`);
    // dispatch(updateStoredCv({ applicantId, cvData: { isDefault: true, id: cvId } })); // Uncomment and adjust if API supports this
  };

  return (
    <div className="stored-cv-container card">
      <h5 className="card-header">Hồ sơ đính kèm</h5>
      <div className="card-body">
        <div className="upload-box" onClick={() => fileInputRef.current.click()}>
          <BsCloudUpload size={40} className="text-muted" />
          <p className="mt-2">Tải CV từ máy tính của bạn</p>
          <p className="text-muted small">Kích thước không quá 5MB. Hỗ trợ định dạng: PDF, DOC, DOCX.</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept=".pdf,.doc,.docx"
          />
        </div>
        <button
          className="btn btn-primary mt-3"
          onClick={handleUpload}
          disabled={!selectedFile}
        >
          Tải lên
        </button>

        {status === 'loading' && <p className="mt-3">Đang tải...</p>}
        {status === 'failed' && <p className="mt-3 text-danger">Lỗi: {error}</p>}

        <div className="cv-list mt-4">
          {cv && Array.isArray(cv) ? (
            cv.map((cvItem) => (
              <div key={cvItem.id} className="cv-card">
                <div className="cv-icon">
                  <BsFileEarmarkPdf size={30} />
                </div>
                <div className="cv-info">
                  <p className="cv-name">{cvItem.name || `CV_${cvItem.id}`}</p>
                  <p className="cv-date text-muted small">
                    Tải lên vào: {cvItem.uploadDate || new Date().toLocaleDateString('vi-VN')}
                  </p>
                </div>
                {cvItem.isDefault && <span className="default-badge">Mặc định</span>}
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
                    <li><hr className="dropdown-divider" /></li>
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
          ) : (
            status === 'succeeded' && <p className="mt-3">Không có CV nào được lưu.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoredCv;