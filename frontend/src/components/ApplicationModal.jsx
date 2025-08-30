import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { BsDownload, BsCheckCircle, BsPlusCircle } from 'react-icons/bs';
import axios from 'axios';
import { fetchStoredCv } from '../features/cv/cvAction';
import { fetchApplicantProfile } from '../features/applicant-profile/applicantProfileActions';

const ApplicationModal = ({ show, onHide, job }) => {
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');

    const [selectedCv, setSelectedCv] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const applicantProfileState = useSelector((state) => state.applicantProfile);
    const cvsState = useSelector((state) => state.cv);
    const cvs = cvsState.cv || [];

    useEffect(() => {
        if (show && token && applicantProfileState.status === 'idle') {
            dispatch(fetchApplicantProfile(token));
        }
    }, [show, token, dispatch, applicantProfileState.status]);

    // console.log("applicantProfileState: ", applicantProfileState.profile)

    useEffect(() => {
        console.log("show: ", show)
        console.log("applicantProfileState.profile: ",applicantProfileState.profile)
        if (
            show &&
            applicantProfileState.profile
        ) {
            dispatch(
                fetchStoredCv({
                    applicantId: applicantProfileState.profile?.data?.id,
                })
            );
        }
    }, [show, applicantProfileState.profile?.id, cvsState.status, dispatch, token]);

    console.log("cvs: ", cvs)

    useEffect(() => {
        if (cvs.length > 0 && !selectedCv) {
            setSelectedCv(cvs[0].id);
        }
    }, [cvs, selectedCv]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCv) {
            setError('Vui lòng chọn CV');
            return;
        }

        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/v1/applications/`,
                {
                    job_post: job.id,
                    cv: selectedCv,
                    cover_letter: coverLetter,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setSuccess('Ứng tuyển thành công!');
            setTimeout(() => {
                onHide();
                setCoverLetter('');
                setSelectedCv(null);
                setSuccess('');
            }, 2000);
        } catch (err) {
            console.error('Lỗi khi ứng tuyển:', err);
            if (err.response?.data) {
                setError(err.response.data.detail || err.response.data.message || 'Có lỗi xảy ra khi ứng tuyển');
            } else {
                setError('Có lỗi xảy ra khi ứng tuyển');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleRefreshCV = () => {
        if (applicantProfileState.data?.id) {
            dispatch(fetchStoredCv({ applicantId: applicantProfileState.data.id, token }));
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Ứng tuyển: {job?.name}</Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
                    {cvsState.error && <Alert variant="warning" dismissible onClose={() => dispatch(clearCvError())}>{cvsState.error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <Form.Group className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <Form.Label className="mb-0">
                                <strong>Chọn CV *</strong>
                            </Form.Label>
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={handleRefreshCV}
                                disabled={status === 'loading'}
                            >
                                <BsPlusCircle className="me-1" />
                                Làm mới
                            </Button>
                        </div>

                        {status === 'loading' ? (
                            <div className="text-center py-3">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-2">Đang tải danh sách CV...</p>
                            </div>
                        ) : cvs && cvs.length === 0 ? (
                            <Alert variant="warning">
                                Bạn chưa có CV nào. Vui lòng tải lên CV trước khi ứng tuyển.
                            </Alert>
                        ) : (
                            <div className="cv-list">
                                {cvs && cvs.map((cv) => (
                                    <div
                                        key={cv.id}
                                        className={`cv-item p-3 mb-2 border rounded ${selectedCv === cv.id ? 'border-primary bg-light' : 'border-light'
                                            }`}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setSelectedCv(cv.id)}
                                    >
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center">
                                                {selectedCv === cv.id && (
                                                    <BsCheckCircle className="text-primary me-2" />
                                                )}
                                                <div>
                                                    <h6 className="mb-1">CV #{cv.id}</h6>
                                                    <small className="text-muted">
                                                        Tải lên: {formatDate(cv.uploaded_at)}
                                                    </small>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.open(cv.link, '_blank');
                                                }}
                                            >
                                                <BsDownload className="me-1" />
                                                Xem
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            <strong>Thư giới thiệu (Cover Letter)</strong>
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={6}
                            placeholder="Viết thư giới thiệu ngắn gọn về bản thân và lý do bạn phù hợp với công việc này..."
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            disabled={submitting}
                            maxLength={2000}
                        />
                        <Form.Text className="text-muted">
                            {coverLetter.length}/2000 ký tự. Đây là cơ hội để gây ấn tượng với nhà tuyển dụng!
                        </Form.Text>
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide} disabled={submitting}>
                        Hủy
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={submitting || !cvs || cvs.length === 0}
                    >
                        {submitting ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Đang gửi...
                            </>
                        ) : (
                            'Gửi đơn ứng tuyển'
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ApplicationModal;